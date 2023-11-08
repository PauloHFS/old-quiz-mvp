import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { pagination } from '../../middlewares/pagination.js';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { verifySession } from '../../middlewares/verifySession.js';
import {
  createNewQuiz,
  createNewQuizResponse,
  getQuizById,
  listAllQuizes,
} from './controllers.js';
import { createNewQuizSchema, createResponseSchema } from './validations.js';

const QuizRouter = express.Router();

QuizRouter.get('/', verifySession, pagination(), listAllQuizes);
QuizRouter.get('/:id', verifySession, getQuizById);
QuizRouter.post(
  '/',
  verifySession,
  validateZodSchema(createNewQuizSchema),
  createNewQuiz
);
QuizRouter.post(
  '/response',
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validateZodSchema(createResponseSchema),
  createNewQuizResponse
);

export { QuizRouter };
