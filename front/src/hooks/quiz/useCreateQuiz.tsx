import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { apiClient } from '../../services/api';

const quizSchema = z.object({
  nome: z
    .string()
    .min(2, 'nome precisa ter no mínimo 2 caracteres')
    .max(100, 'nome precisa ter no máximo 100 caracteres'),
  questoes: z
    .array(
      z.object({
        titulo: z
          .string()
          .min(2, 'titulo precisa ter no mínimo 2 caracteres')
          .max(100, 'titulo precisa ter no máximo 100 caracteres'),
        alternativas: z
          .array(z.string())
          .min(2, 'precisa ter no mínimo 2 alternativas')
          .max(4, 'precisa ter no máximo 4 alternativas'),
        correctIndex: z.number(),
      })
    )
    .min(1, 'precisa ter no mínimo 1 questão')
    .max(10, 'precisa ter no máximo 10 questões'),
});

type Quiz = z.infer<typeof quizSchema>;

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: (data: Quiz) => apiClient.post('/quiz', data),
  });
};
