export interface IApiService<C> {
  get: <T = unknown>(url: string, config?: C) => Promise<T>;
  post: <T = unknown, K = unknown>(
    url: string,
    body: K,
    config?: C,
  ) => Promise<T>;
  setAuthentication: (token: string) => void;
  setBaseUrl: (url: string) => void;
}
