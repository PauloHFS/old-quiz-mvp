import { z } from 'zod';

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

type CreateNewQuizSchemaType = z.infer<typeof createNewQuizSchema>;
