import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bycript from 'bcrypt';
import { BrasilDictionary } from '../services/brasil';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'Ab@12312';

const createNewUser = async ({
  email,
  name,
  password,
}: {
  email?: string;
  name?: string;
  password?: string;
}) => {
  const hashedPassword = await bycript.hash(password ?? DEFAULT_PASSWORD, 10);
  const user = await prisma.user.create({
    data: {
      email: email ?? faker.internet.email(),
      name: name ?? faker.person.fullName(),
      password: hashedPassword,
      verified: true,
    },
  });

  console.log(`[SEED] Created user ${user.email}`);

  return user;
};

const createNewQuiz = async ({
  userId,
  question_count = 3,
  alternatives_count = 4,
}: {
  userId: number;
  question_count?: number;
  alternatives_count?: number;
}) => {
  const quiz = await prisma.quiz.create({
    data: {
      name: faker.lorem.words(2),
      userId: 1,
      Question: {
        createMany: {
          data: Array.from({ length: question_count }).map(() => ({
            title: `${faker.lorem.words(5)}?`,
            alternatives: Array.from({
              length: alternatives_count,
            }).map(() => `${faker.lorem.words(2)}!`),
            correctIndex: faker.number.int({
              min: 0,
              max: 3,
            }),
          })),
        },
      },
    },
    include: {
      Question: true,
    },
  });

  console.log(
    `[SEED] Created quiz ${quiz.name}, with ${
      quiz.Question.length
    } questions and ${quiz.Question.reduce(
      (acc, curr) => acc + curr.alternatives.length,
      0
    )} alternatives in total`
  );

  return quiz;
};

/**
 * Create 100 new responses for every question on the quiz
 */
const populateResponse = async ({ quizId }: { quizId: number }) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      Question: true,
    },
  });

  if (!quiz) {
    console.error(
      `[SEED] Can't populate responses - Quiz with id ${quizId} not found`
    );
    return;
  }

  const usersInfo = await prisma.responseUserInfo.createMany({
    data: Array.from({ length: 100 }).map(() => {
      const stateIndex = faker.number.int({
        max: BrasilDictionary.length - 1,
      });
      const state = BrasilDictionary[stateIndex].nome;
      const cityIndex = faker.number.int({
        max: BrasilDictionary[stateIndex].cidades.length - 1,
      });
      const city = BrasilDictionary[stateIndex].cidades[cityIndex];

      return {
        quizId,
        gender: Math.random() > 0.5 ? 'female' : 'male',
        age: faker.number.int({ min: 18, max: 100 }),
        geolocation: `${city}-${state}`,
      };
    }),
    skipDuplicates: true,
  });

  console.log(`[SEED] Created ${usersInfo.count} responseUserInfo`);

  const responseUserInfoIds = await prisma.responseUserInfo.findMany({
    where: {
      quizId,
    },
    select: {
      id: true,
    },
  });

  const responses = await prisma.response.createMany({
    data: quiz.Question.flatMap(question =>
      responseUserInfoIds.map(responseUserInfo => ({
        responseUserInfoId: responseUserInfo.id,
        questionId: question.id,
        alternative:
          question.alternatives[
            faker.number.int({
              min: 0,
              max: question.alternatives.length - 1,
            })
          ],
      }))
    ),
    skipDuplicates: true,
  });

  console.log(`[SEED] Created ${responses.count} responses`);
};

const seed = async () => {
  const user1 = await createNewUser({});
  const quiz1 = await createNewQuiz({ userId: user1.id });
  await populateResponse({ quizId: quiz1.id });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
