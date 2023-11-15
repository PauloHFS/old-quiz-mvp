import express from 'express';
import rateLimit from 'express-rate-limit';
import { validateZodSchema } from '../../middlewares/validateZodSchema';
import {
  login,
  logout,
  refreshToken,
  signup,
  verifyToken,
} from './controllers';
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  signupSchema,
  verifyTokenSchema,
} from './validations';

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), login);
AuthRouter.post('/logout', validateZodSchema(logoutSchema), logout);
AuthRouter.post(
  '/signup',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), // 10 requests por hora
  validateZodSchema(signupSchema),
  signup
);
AuthRouter.post(
  '/refresh-token',
  rateLimit({ windowMs: 60 * 1000, max: 10 }), // 10 requests por minuto
  validateZodSchema(refreshTokenSchema),
  refreshToken
);
AuthRouter.post(
  '/verify-token',
  rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 1 }), // 1 request por dia
  validateZodSchema(verifyTokenSchema),
  verifyToken
);

export { AuthRouter };
