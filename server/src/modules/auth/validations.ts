import z from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email - Inválido'),
    password: z
      .string()
      .min(6, 'password precisa ter no mínimo 6 caracteres')
      .max(100, 'password precisa ter no máximo 100 caracteres'),
  }),
});
