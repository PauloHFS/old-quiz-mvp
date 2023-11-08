import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const envSchema = zod.object({
  PORT: zod.string().default('8080').readonly(),
});

export const env = envSchema.parse(process.env);
