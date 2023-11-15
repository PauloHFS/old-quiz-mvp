import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { apiClient } from '../../services/api';

export const responseSchema = z.object({
  quizId: z.number(),
  userData: z.object({
    gender: z.string(),
    age: z.number(),
    geolocation: z.string(),
  }),
  responses: z.array(
    z.object({
      questionId: z.number(),
      alternativa: z.string(),
    })
  ),
});

export type ResponseData = z.infer<typeof responseSchema>;

export const useCreateResponse = (
  options?: UseMutationOptions<ResponseData, AxiosError, ResponseData>
) => {
  return useMutation({
    mutationFn: ({ quizId, ...response }) =>
      apiClient.post('/quiz/' + quizId + '/response', response),
    ...options,
  });
};
