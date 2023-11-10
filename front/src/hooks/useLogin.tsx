import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '../services/api';

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const useLogin = (
  options?: UseMutationOptions<LoginResponse, AxiosError, LoginParams>
) =>
  useMutation({
    mutationFn: data =>
      apiClient.post<LoginResponse>('/auth/login', data).then(res => res.data),
    onSuccess: ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    ...options,
  });
