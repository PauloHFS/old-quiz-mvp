import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const envSchema = zod.object({
  PORT: zod.string().min(1).default('8080').readonly(),
  JWT_SECRET: zod.string().min(1).default('secret').readonly(),
  DATABASE_URL: zod.string().min(1).readonly(),
  RESEND_API_KEY: zod.string().min(1).readonly(),
});

export const env = envSchema.parse(process.env);
