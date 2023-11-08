import express from 'express';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { loginSchema } from './validations.js';

const AuthRouter = express.Router();

AuthRouter.post('/login', validateZodSchema(loginSchema), async (req, res) => {
  res.send('ok');
});

export { AuthRouter };
