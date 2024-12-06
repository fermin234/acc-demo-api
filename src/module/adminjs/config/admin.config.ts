import { validate } from 'class-validator';
import { DataSource } from 'typeorm';

import {
  adminResources,
  adminSchemas,
} from '@common/admin/infrastructure/database/admin-resource';

import { ENVIRONMENT } from '@config/environment.enum';
import { datasourceOptions } from '@config/orm.config';

import { AuthenticationService } from '@iam/authentication/application/service/authentication.service';
import { AuthenticationModule } from '@iam/authentication/authentication.module';
import { AuthenticationProvider } from '@iam/authentication/infrastructure/admin/admin-authentication.provider';
import { UserService } from '@iam/user/application/service/user.service';
import { UserModule } from '@iam/user/user.module';

import { TestingEmptyModule } from '@test/test.empty.module';
import { loadComponents } from '@/module/adminjs/components/components';


export const importNonCommonJSModule = async (packageName: string) => {
  return new Function(`return import('${packageName}')`)();
};

export const registerDatabaseOnAdminJS = async () => {
  const adminJSModule = await importNonCommonJSModule('adminjs');
  const AdminJS = adminJSModule.default;

  const { Database, Resource } =
    await importNonCommonJSModule('@adminjs/typeorm');

  Resource.validate = validate;
  AdminJS.registerAdapter({ Database, Resource });
};

export const initializeAdminJS = async (
  authenticationService: AuthenticationService,
  userService: UserService,
) => {
  const { componentLoader, Components } = await loadComponents();

  const ADMIN_JS_ROOT_PATH = '/admin';
  const COOKIE_NAME = 'adminjs-session-cookie';

  const dataSource = await new DataSource({
    ...datasourceOptions,
    entities: adminSchemas,
  }).initialize();

  return {
    adminJsOptions: {env: {BASE_APP_URL: process.env.BASE_APP_URL,}, assets: {
    styles: [
      'https://cdn.jsdelivr.net/npm/react-toastify@10.0.6/dist/ReactToastify.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/vs2015.min.css',
    ],}, pages: {
    'chat-with-your-database': {
      component: Components.ChatWithYourDatabase,
    },}, componentLoader, rootPath: ADMIN_JS_ROOT_PATH,
      resources: adminResources.map((resource) => ({
        ...resource,
        dataSource,
      })),},
    auth: {
      provider: new AuthenticationProvider(authenticationService, userService),
      enable: true,
      secret: process.env.ADMINJS_SECRET,
      cookieName: COOKIE_NAME,
      cookiePassword: process.env.ADMINJS_COOKIE_PASSWORD,
    },
    sessionOptions: {
      resave: false,
      saveUninitialized: true,
    },
  };
};

export const getAdminJSModule = async () => {
  if (process.env.NODE_ENV === ENVIRONMENT.AUTOMATED_TESTS) {
    return TestingEmptyModule;
  }

  const { AdminModule } = await importNonCommonJSModule('@adminjs/nestjs');

  return AdminModule.createAdminAsync({
    imports: [AuthenticationModule, UserModule],
    useFactory: async (
      authenticationService: AuthenticationService,
      userService: UserService,
    ) => initializeAdminJS(authenticationService, userService),
    inject: [AuthenticationService, UserService],
  });
};
