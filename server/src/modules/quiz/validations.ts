import { z } from 'zod';

export const getQuizByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const createNewQuizSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(2, 'nome precisa ter no mínimo 2 caracteres')
      .max(100, 'nome precisa ter no máximo 100 caracteres'),
    questoes: z.array(
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
    ),
  }),
});

export const createResponseSchema = z.object({
  body: z.object({
    quizId: z.number(),
    userData: z.object({
      gender: z.string(),
      age: z.number().min(1).max(100),
      geolocation: z.string(),
    }),
    responses: z.array(
      z.object({
        questionId: z.number(),
        alternativa: z.string(),
      })
    ),
  }),
});
