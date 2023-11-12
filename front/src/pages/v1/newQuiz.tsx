import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/Button';

const schema = z.object({
  name: z.string().min(1),
  questions: z.array(
    z.object({
      title: z.string().min(1),
      alternatives: z.array(z.string().min(1)),
      correctID: z.number().int().min(0),
    })
  ),
});

const regexIndex = /\[(\d+)\]/;

type NewQuizFormData = z.infer<typeof schema>;

export const NewQuiz = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewQuizFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: NewQuizFormData) => {
    console.log(data);
  };

  const defaultQuestion = {
    title: '',
    alternatives: ['', ''],
    correctID: 0,
  };

  const [questions, setQuestions] = useState<NewQuizFormData['questions']>([]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, defaultQuestion]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prev => [
      ...prev.slice(0, questionIndex),
      ...prev.slice(questionIndex + 1),
    ]);
  };

  const addAlternative = (questionIndex: number) => {
    setQuestions(prev => {
      const question = prev[questionIndex];
      const newQuestion = {
        ...question,
        alternatives: [...question.alternatives, ''],
      };
      return [
        ...prev.slice(0, questionIndex),
        newQuestion,
        ...prev.slice(questionIndex + 1),
      ];
    });
  };

  const removeAlternative = (
    questionIndex: number,
    alternativeIndex: number
  ) => {
    setQuestions(prev => {
      const question = prev[questionIndex];
      const newQuestion = {
        ...question,
        alternatives: [
          ...question.alternatives.slice(0, alternativeIndex),
          ...question.alternatives.slice(alternativeIndex + 1),
        ],
      };
      return [
        ...prev.slice(0, questionIndex),
        newQuestion,
        ...prev.slice(questionIndex + 1),
      ];
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const nameParts = name.split('.');
    const indexMatch = nameParts[0].match(regexIndex)?.[1];
    if (indexMatch === undefined) {
      return;
    }

    const questionIndex = Number(indexMatch);
    const question = questions[questionIndex];

    if (nameParts[1] === 'title') {
      const newQuestion = {
        ...question,
        title: value,
      };

      const newQuestions = [
        ...questions.slice(0, questionIndex),
        newQuestion,
        ...questions.slice(questionIndex + 1),
      ];

      setQuestions(newQuestions);
      return;
    } else if (nameParts[1].includes('alternatives')) {
      const indexMatch = nameParts[1].match(regexIndex)?.[1];
      if (indexMatch === undefined) {
        return;
      }

      const alternativeIndex = Number(indexMatch);

      if (nameParts[2] === 'title') {
        const newQuestion = {
          ...question,
          alternatives: [
            ...question.alternatives.slice(0, alternativeIndex),
            value,
            ...question.alternatives.slice(alternativeIndex + 1),
          ],
        };

        const newQuestions = [
          ...questions.slice(0, questionIndex),
          newQuestion,
          ...questions.slice(questionIndex + 1),
        ];

        setQuestions(newQuestions);
        return;
      } else if (nameParts[2] === 'correctID') {
        const newQuestion = {
          ...question,
          correctID: alternativeIndex,
        };

        const newQuestions = [
          ...questions.slice(0, questionIndex),
          newQuestion,
          ...questions.slice(questionIndex + 1),
        ];

        setQuestions(newQuestions);
        return;
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="name" className="flex flex-col">
          1. Adicione o nome do seu quiz:
          <input
            {...register('name')}
            placeholder="Pesquisa do Evento X"
            className="border-2 border-gray-300"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </label>
        <div>
          <h2>2. Adicione questões da sua pesquisa:</h2>
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <div className="flex gap-2">
              <h3>{`${questionIndex + 1}. `}</h3>
              <input
                type="text"
                name={`questions[${questionIndex}].title`}
                placeholder="Você gostou do evento?"
                className="border-b-2 border-gray-300"
                value={question.title}
                onChange={handleFormChange}
              />
              <Button.Primary onClick={() => removeQuestion(questionIndex)}>
                -
              </Button.Primary>
            </div>
            <div>
              {question.alternatives.map((alternative, alternativeIndex) => (
                <div
                  key={questionIndex + '.' + alternativeIndex}
                  className="flex gap-2"
                >
                  <h4>
                    {questionIndex + 1}.{alternativeIndex + 1}.{' '}
                  </h4>
                  <input
                    type="text"
                    placeholder={`Sim, não, talvez...`}
                    className="rounded-md border-b-2 border-gray-300"
                    name={`questions[${questionIndex}].alternatives[${alternativeIndex}].title`}
                    value={alternative}
                    onChange={handleFormChange}
                  />
                  <input
                    type="radio"
                    name={`questions[${questionIndex}].alternatives[${alternativeIndex}].correctID`}
                    checked={alternativeIndex === question.correctID}
                    onChange={handleFormChange}
                  />
                  <Button.Primary
                    onClick={() =>
                      removeAlternative(questionIndex, alternativeIndex)
                    }
                  >
                    -
                  </Button.Primary>
                </div>
              ))}
            </div>
            <Button.Primary onClick={() => addAlternative(questionIndex)}>
              Adicionar Alternativa
            </Button.Primary>
          </div>
        ))}
        <div>
          <Button.Primary onClick={addQuestion}>Criar Questão</Button.Primary>
        </div>

        <div className="self-center">
          <Button.Primary type="submit">Criar Quiz</Button.Primary>
        </div>
      </form>
    </main>
  );
};
