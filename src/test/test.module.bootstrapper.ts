import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';

import {
  IDENTITY_PROVIDER_SERVICE_KEY,
  IIdentityProviderService,
} from '@iam/authentication/application/service/identity-provider.service.interface';

import { AppModule } from '@/module/app/app.module';
import {
  IChatService,
  OPENAI_SERVICE_KEY,
} from '@/module/chat/application/interfaces/chat.service.interfaces';
import {
  DATABASE_SERVICE_KEY,
  IDatabaseService,
} from '@/module/db/application/interfaces/database.service.interfaces';

export const openaiServiceMock: jest.MockedObject<IChatService> = {
  sendMessage: jest.fn(),
  generateFormalResponse: jest.fn(),
};

export const databaseServiceMock: jest.MockedObject<IDatabaseService> = {
  executeQuery: jest.fn(),
  allModels: jest.fn(),
  getTableSchema: jest.fn(),
  databaseInfo: jest.fn(),
};

export const identityProviderServiceMock: jest.MockedObject<IIdentityProviderService> =
  {
    signUp: jest.fn(),
    signIn: jest.fn(),
    confirmUser: jest.fn(),
    forgotPassword: jest.fn(),
    confirmPassword: jest.fn(),
    resendConfirmationCode: jest.fn(),
    refreshSession: jest.fn(),
  };

export const testModuleBootstrapper = (): Promise<TestingModule> => {
  initializeTransactionalContext();

  return Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(IDENTITY_PROVIDER_SERVICE_KEY)
    .useValue(identityProviderServiceMock)
    .overrideProvider(OPENAI_SERVICE_KEY)
    .useValue(openaiServiceMock)
    .overrideProvider(DATABASE_SERVICE_KEY)
    .useValue(databaseServiceMock)
    .compile();
};
