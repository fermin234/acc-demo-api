import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { IHTTPRequestService } from '../interfaces/http-request-service';

export const axiosInstance = axios.create();

function createAxiosService(
  instance: AxiosInstance,
): IHTTPRequestService<AxiosRequestConfig> {
  return {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await instance.get<T>(url, config);
      return response.data;
    },
    post: async <T, K = unknown>(
      url: string,
      body: K,
      config?: AxiosRequestConfig,
    ): Promise<T> => {
      const response = await instance.post<T>(url, body, config);
      return response.data;
    },
    setAuthentication: (token: string) => {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return;
    },
    setBaseUrl: (url: string) => {
      instance.defaults.baseURL = url;
      return;
    },
  };
}

export const axiosService = createAxiosService(axiosInstance);
