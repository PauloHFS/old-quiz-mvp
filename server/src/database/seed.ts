import { PrismaClient } from '@prisma/client';
import bycript from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bycript.hash('Ab@12312', 10);
  const paulo = await prisma.user.upsert({
    where: { email: 'paulohernane10@gmail.com' },
    update: {},
    create: {
      email: 'paulohernane10@gmail.com',
      name: 'Paulo Hernane',
      password: hashedPassword,
      Quiz: {
        create: [
          {
            name: 'Quiz de teste',
            Question: {
              create: [
                {
                  title: 'Qual o nome do criador do Quiz?',
                  alternatives: [
                    'Paulo Hernane',
                    'Paulo',
                    'Hernane',
                    'Paulo Hernane de Oliveira',
                  ],
                  correctIndex: 0,
                },
                {
                  title: 'Que dia é hoje?',
                  alternatives: ['Segunda', 'Terça', 'Quarta', 'Quinta'],
                  correctIndex: 1,
                },
              ],
            },
          },
          {
            name: 'Quiz de teste 2',
            Question: {
              create: [
                {
                  title: 'Bom dia meu?',
                  alternatives: ['Prefeito', 'Povo', 'Amor'],
                  correctIndex: 0,
                },
                {
                  title: 'Que dia é hoje?',
                  alternatives: ['Segunda', 'Terça', 'Quarta', 'Quinta'],
                  correctIndex: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ paulo });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
