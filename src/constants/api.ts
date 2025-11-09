export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

export const Endpoints = {
  posts: '/posts',
  login: '/auth/login',
  register: '/auth/register',
} as const;