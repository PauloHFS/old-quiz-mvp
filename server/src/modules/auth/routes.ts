import express from 'express';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { login, signup } from './controllers.js';
import { loginSchema, signupSchema } from './validations.js';

const users = [];

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), login);

AuthRouter.post('/signup', validateZodSchema(signupSchema), signup);

export { AuthRouter };
