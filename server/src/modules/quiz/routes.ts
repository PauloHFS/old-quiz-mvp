import express from 'express';
import { pagination } from '../../middlewares/pagination.js';
import { validateZodSchema } from '../../middlewares/validateZodSchema.js';
import { verifySession } from '../../middlewares/verifySession.js';
import { createNewQuiz, getQuizById, listAllQuizes } from './controllers.js';
import { createNewQuizSchema } from './validations.js';

const QuizRouter = express.Router();

QuizRouter.get('/', verifySession, pagination(), listAllQuizes);
QuizRouter.get('/:id', verifySession, getQuizById);
QuizRouter.post(
  '/',
  verifySession,
  validateZodSchema(createNewQuizSchema),
  createNewQuiz
);

export { QuizRouter };
