import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { apiClient } from '../../services/api';

const responseSchema = z.object({
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

type Response = z.infer<typeof responseSchema>;

export const useCreateResponse = () => {
  return useMutation({
    mutationFn: ({ quizId, ...response }: Response) =>
      apiClient.post('/quiz/' + quizId + '/response', response),
  });
};
