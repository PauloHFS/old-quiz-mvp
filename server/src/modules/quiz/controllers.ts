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
        Questions: true,
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
        Questions: {
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
        Questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const responseUserInfos = await prismaClient.responseUserInfo.findMany({
      where: {
        quizId,
      },
      include: {
        Responses: true,
      },
    });

    // - total de respostas por quiz
    const total = responseUserInfos.length;

    // - total dividido por genero
    const genderCountMap = {
      female: 0,
      male: 0,
    };

    responseUserInfos.forEach(({ gender }) => {
      if (!(gender in genderCountMap)) return;
      const k = gender as 'female' | 'male';
      genderCountMap[k] += 1;
    });

    // - total dividido por idade
    const ageCountMap: { [age: number]: number } = {};

    responseUserInfos.forEach(({ age }) => {
      const count = ageCountMap[age] || 0;
      ageCountMap[age] = count + 1;
    });

    // - ranking de top 3 cidades com mais respostas
    const geolocationCountMap: { [geolocation: string]: number } = {};
    responseUserInfos.forEach(({ geolocation }) => {
      const count = geolocationCountMap[geolocation] || 0;
      geolocationCountMap[geolocation] = count + 1;
    });
    const top3Geolocation = Object.entries(geolocationCountMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([geolocation]) => geolocation);

    // - total de respostas por pergunta
    const questionIdToTitle = new Map<number, string>();
    quiz.Questions.forEach(({ id, title }) => {
      questionIdToTitle.set(id, title);
    });

    const questionStats: {
      questionTitle: string;
      alternatives: {
        alternative: string;
        count: number;
        correct: boolean;
      }[];
    }[] = [];

    quiz.Questions.forEach(({ id, alternatives, correctIndex }) => {
      const alternativeCountMap: { [alternative: string]: number } = {};
      responseUserInfos.forEach(({ Responses }) => {
        const response = Responses.find(({ questionId }) => questionId === id);
        if (!response) return;
        const { alternative } = response;
        const count = alternativeCountMap[alternative] || 0;
        alternativeCountMap[alternative] = count + 1;
      });

      const alternativesStats = alternatives.map((alternative, index) => ({
        alternative,
        count: alternativeCountMap[alternative] || 0,
        correct: index === correctIndex,
      }));

      questionStats.push({
        questionTitle: questionIdToTitle.get(id) || '',
        alternatives: alternativesStats,
      });
    });

    return res.json({
      total,
      genderTotal: genderCountMap,
      ageTotal: ageCountMap,
      geoTotal: top3Geolocation,
      questionTotal: questionStats,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
