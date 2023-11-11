import { JwtPayload } from 'jsonwebtoken';
import * as z from 'zod';

export const userPayloadSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});

export interface JwtData
  extends z.infer<typeof userPayloadSchema>,
    JwtPayload {}

export const paginationSchema = z.object({
  skip: z.string().optional().default('0').transform(Number),
  take: z.string().optional().default('10').transform(Number),
  cursor: z.string().optional().transform(Number),
});
