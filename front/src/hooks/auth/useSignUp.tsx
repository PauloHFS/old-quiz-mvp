import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { apiClient } from '../../services/api';

export const signUpSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome precisa ter no mínimo 2 caracteres')
    .max(100, 'Nome precisa ter no máximo 100 caracteres'),
  email: z.string().email('Digite um email válido!'),
  password: z
    .string()
    .min(6, 'Senha precisa ter no mínimo 6 caracteres')
    .max(100, 'Senha precisa ter no máximo 100 caracteres'),
});

type SignUpParams = z.infer<typeof signUpSchema>;

type SignUpResponse = {
  email: string;
  id: number;
  name: string;
  verified: boolean;
};

export const useSignUp = (
  options?: UseMutationOptions<SignUpResponse, AxiosError, SignUpParams>
) =>
  useMutation({
    mutationFn: data =>
      apiClient
        .post<SignUpResponse>('/auth/signup', data)
        .then(res => res.data),
    ...options,
  });
