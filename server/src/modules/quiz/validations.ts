import { z } from 'zod';
import { paginationSchema, userPayloadSchema } from '../../types';

export const listAllQuizesSchema = z.object({
  query: paginationSchema.merge(z.object({})),
  body: z.object({
    user: userPayloadSchema,
  }),
});

export const getQuizByIdSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
});

export const createNewQuizSchema = z.object({
  body: z.object({
    user: userPayloadSchema,
    nome: z
      .string()
      .min(2, 'nome precisa ter no mínimo 2 caracteres')
      .max(100, 'nome precisa ter no máximo 100 caracteres'),
    questoes: z
      .array(
        z
          .object({
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
          .refine(
            data =>
              data.alternativas.length > data.correctIndex ||
              data.correctIndex < 0,
            {
              message: 'index da alternativa correta precisa ser válido',
            }
          )
      )
      .min(1, 'precisa ter no mínimo 1 questão')
      .max(10, 'precisa ter no máximo 10 questões'),
  }),
});

export const createResponseSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
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
