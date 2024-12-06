import { AxiosRequestConfig } from 'axios';

import { axiosService } from '../config/axios';
import { IHTTPRequestService } from '../interfaces/http-request-service';
import { IApiService } from '../interfaces/services/IApiService';

class ApiService<C = unknown> implements IApiService<C> {
  httpService: IHTTPRequestService<C>;
  constructor(httpService: IHTTPRequestService<C>) {
    this.httpService = httpService;
  }
  get<T>(url: string, config?: C): Promise<T> {
    return this.httpService.get<T>(url, config);
  }
  post<T = unknown, K = unknown>(url: string, body: K, config?: C): Promise<T> {
    return this.httpService.post<T>(url, body, config);
  }
  setAuthentication(token: string) {
    return this.httpService.setAuthentication(token);
  }
  setBaseUrl(url: string) {
    return this.httpService.setBaseUrl(url);
  }
}

export type ApiRequestConfig = AxiosRequestConfig;
export const apiService = new ApiService<ApiRequestConfig>(axiosService);
