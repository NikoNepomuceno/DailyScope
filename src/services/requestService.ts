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