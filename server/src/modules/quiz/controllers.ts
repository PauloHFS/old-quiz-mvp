import { Request, Response } from 'express';
import { prismaClient } from '../../database/index';
import {
  createNewQuizSchema,
  createResponseSchema,
  listAllQuizesSchema,
} from './validations';

export const listAllQuizes = async (req: Request, res: Response) => {
  try {
    // TODO add cursor
    const {
      body: { user },
      query: { skip, take },
    } = listAllQuizesSchema.parse(req);

    const quizes = await prismaClient.quiz.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      take,
      skip,
    });

    const count = await prismaClient.quiz.count({
      where: {
        userId: user.id,
      },
    });

    return res.json({
      data: quizes,
      meta: {
        skip,
        take,
        count,
      },
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    // TODO Add validation
    const user = req.body.user;

    const quizId = Number(req.params.id);

    const quiz = await prismaClient.quiz.findUnique({
      where: {
        id: quizId,
        userId: user.id,
      },
      include: {
        Question: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    return res.json(quiz);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createNewQuiz = async (req: Request, res: Response) => {
  try {
    const {
      body: { user, nome, questoes },
    } = createNewQuizSchema.parse(req);

    const quiz = await prismaClient.quiz.create({
      data: {
        name: nome,
        Question: {
          create: questoes.map(({ titulo, alternativas, correctIndex }) => ({
            title: titulo,
            alternatives: alternativas,
            correctIndex,
          })),
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createNewQuizResponse = async (req: Request, res: Response) => {
  try {
    const {
      params: { id: quizId },
      body: {
        responses,
        userData: { age, gender, geolocation },
      },
    } = createResponseSchema.parse(req);

    const responseUserInfo = await prismaClient.responseUserInfo.create({
      data: {
        age,
        gender,
        geolocation,
        quizId,
      },
    });

    const { count } = await prismaClient.response.createMany({
      data: responses.map(({ questionId, alternativa }) => ({
        alternative: alternativa,
        questionId,
        responseUserInfoId: responseUserInfo.id,
      })),
    });

    return res.status(201).json({
      responseUserInfo,
      responses: count,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getQuizStats = async (req: Request, res: Response) => {
  try {
    // TODO Add validation
    const quizId = Number(req.params.id);

    const quiz = await prismaClient.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        Question: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    return res.json({
      quizId,
      message: 'stats',
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
