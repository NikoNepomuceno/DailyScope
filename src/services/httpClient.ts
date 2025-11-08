import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function toError(e: any): Error {
  const message = e?.response?.data?.message || e?.message || 'Request failed';
  const err = new Error(message);
  (err as any).status = e?.response?.status;
  (err as any).details = e?.response?.data;
  return err;
}