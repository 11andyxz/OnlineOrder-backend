import axios from 'axios';
import type { ApiResponse } from './types';
import { useAuthStore } from '@store/auth';

export const http = axios.create({
  baseURL: '/api'
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    const resp = res.data as ApiResponse<unknown>;
    if (resp && typeof resp === 'object' && 'success' in resp) {
      if ((resp as ApiResponse<unknown>).success) {
        return (resp as ApiResponse<any>).data;
      }
      return Promise.reject(new Error((resp as ApiResponse<unknown>).message || '请求失败'));
    }
    return res.data;
  },
  (err) => Promise.reject(err)
);

// Typed helpers so callers receive T (not AxiosResponse<T>)
export function get<T>(url: string, config?: Parameters<typeof http.get>[1]) {
  return http.get<T, T>(url, config);
}

export function post<TRes, TReq = unknown>(
  url: string,
  data?: TReq,
  config?: Parameters<typeof http.post>[2]
) {
  return http.post<TRes, TRes, TReq>(url, data, config);
}

export function put<TRes, TReq = unknown>(
  url: string,
  data?: TReq,
  config?: Parameters<typeof http.put>[2]
) {
  return http.put<TRes, TRes, TReq>(url, data, config);
}


