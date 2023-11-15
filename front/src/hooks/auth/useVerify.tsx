import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { apiClient } from '../../services/api';

export const verifyToken = z.object({
  token: z.string().min(1, 'Token inválido'),
});

type VerifyTokenParams = z.infer<typeof verifyToken>;

export const useVerifyToken = (
  options?: UseMutationOptions<VerifyTokenParams, AxiosError, VerifyTokenParams>
) =>
  useMutation({
    mutationFn: data =>
      apiClient
        .post<VerifyTokenParams>('/auth/verify-token', data)
        .then(res => res.data),
    ...options,
  });
