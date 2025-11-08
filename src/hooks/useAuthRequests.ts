import { useMutation } from '@tanstack/react-query';
import { Endpoints } from '@/constants/api';
import { post } from '@/services/requestService';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/interfaces/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => 
      post<AuthResponse, LoginRequest>(Endpoints.login, credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => 
      post<AuthResponse, RegisterRequest>(Endpoints.register, data),
  });
}