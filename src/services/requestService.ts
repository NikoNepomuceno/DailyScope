import type { AxiosRequestConfig } from 'axios';
import { httpClient, toError } from './httpClient';

export async function get<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const res = await httpClient.get<T>(url, config);
    return res.data;
  } catch (e) {
    throw toError(e);
  }
}

export async function post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
  try {
    const res = await httpClient.post<T>(url, body, config);
    return res.data;
  } catch (e) {
    throw toError(e);
  }
}

export async function put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
  try {
    const res = await httpClient.put<T>(url, body, config);
    return res.data;
  } catch (e) {
    throw toError(e);
  }
}

export async function del<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const res = await httpClient.delete<T>(url, config);
    return res.data;
  } catch (e) {
    throw toError(e);
  }
}