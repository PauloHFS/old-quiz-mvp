import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { apiClient } from '../../services/api';

const quizSchema = z.object({
  nome: z.string(),
  questoes: z.array(
    z.object({
      titulo: z.string(),
      alternativas: z.array(z.string()),
      correctIndex: z.number(),
    })
  ),
});

type Quiz = z.infer<typeof quizSchema>;

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: (data: Quiz) => apiClient.post('/quiz', data),
  });
};
