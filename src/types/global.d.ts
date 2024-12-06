interface AdminJSEnv {
  BASE_APP_URL: string;
}

interface AdminJS {
  env: AdminJSEnv;
}

interface Window {
  AdminJS: AdminJS;
}
