import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const envSchema = zod.object({
  PORT: zod.string().min(1).default('8080').readonly(),
  JWT_SECRET: zod.string().min(1).default('secret').readonly(),
});

export const env = envSchema.parse(process.env);
