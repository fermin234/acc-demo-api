import path from 'path';

import { importNonCommonJSModule } from '@/module/adminjs/config/admin.config';

export const loadComponents = async () => {
  const adminJSModule = await importNonCommonJSModule('adminjs');
  const { ComponentLoader } = adminJSModule;
  const componentLoader = new ComponentLoader();

  const Components = {
    ChatWithYourDatabase: componentLoader.add(
      'ChatWithYourDatabase',
      path.resolve(__dirname, '../app/pages/ChatWithYourDatabase'),
    ),
  };

  return { componentLoader, Components };
};
