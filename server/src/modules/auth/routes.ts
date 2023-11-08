import express from 'express';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { login, logout, refreshToken, signup } from './controllers.js';
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  signupSchema,
} from './validations.js';

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), login);
AuthRouter.post('/logout', validateZodSchema(logoutSchema), logout);
AuthRouter.post('/signup', validateZodSchema(signupSchema), signup);
AuthRouter.post(
  '/refresh-token',
  validateZodSchema(refreshTokenSchema),
  refreshToken
);

export { AuthRouter };
