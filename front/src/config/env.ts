import zod from 'zod';

const envSchema = zod.object({
  VITE_API_URL: zod.string().min(1),
});

const env = envSchema.parse(import.meta.env);

export { env };
