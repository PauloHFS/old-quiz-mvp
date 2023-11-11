import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { validateZodSchema } from '../../middlewares/validateZodSchema';
import { verifySession } from '../../middlewares/verifySession';
import {
  createNewQuiz,
  createNewQuizResponse,
  getQuizById,
  getQuizStats,
  listAllQuizes,
} from './controllers';
import {
  createNewQuizSchema,
  createResponseSchema,
  getQuizByIdSchema,
  listAllQuizesSchema,
} from './validations';

const QuizRouter = express.Router();

QuizRouter.get(
  '/',
  verifySession,
  validateZodSchema(listAllQuizesSchema),
  listAllQuizes
);
QuizRouter.get(
  '/:id',
  verifySession,
  validateZodSchema(getQuizByIdSchema),
  getQuizById
);
QuizRouter.get('/:id/stats', verifySession, getQuizStats);
QuizRouter.post(
  '/',
  verifySession,
  validateZodSchema(createNewQuizSchema),
  createNewQuiz
);
QuizRouter.post(
  '/:id/response',
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validateZodSchema(createResponseSchema),
  createNewQuizResponse
);

export { QuizRouter };
