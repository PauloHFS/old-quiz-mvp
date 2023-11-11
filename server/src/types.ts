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
