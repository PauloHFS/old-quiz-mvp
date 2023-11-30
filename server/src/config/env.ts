import dotenv from 'dotenv';
import * as z from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'debug']).readonly(),
  PORT: z.string().min(1).default('8080').readonly(),
  JWT_SECRET: z.string().min(1).default('secret').readonly(),
  DATABASE_URL: z.string().min(1).readonly(),
  RESEND_API_KEY: z.string().min(1).readonly(),
});

export const env = envSchema.parse(process.env);
