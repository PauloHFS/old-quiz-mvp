import express from 'express';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { login } from './controllers.js';
import { loginSchema } from './validations.js';

const users = [];

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), login);

AuthRouter.post('/signup');

export { AuthRouter };
