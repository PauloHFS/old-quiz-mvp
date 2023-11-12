import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { useCreateQuiz } from '../../hooks/quiz/useCreateQuiz';

const schema = z.object({
  nome: z.string().min(1),
  questoes: z
    .array(
      z.object({
        titulo: z.string().min(1, 'A questão está vazia!'),
        alternativas: z
          .array(z.string().min(1, 'A alternativa está vazia!'))
          .min(2)
          .max(4),
        correctIndex: z.number().int(),
      })
    )
    .min(1, 'Adicione pelo menos uma questão!')
    .max(10, 'Limite de 10 questões atingido!'),
});

type NewQuizFormData = z.infer<typeof schema>;

export const NewQuiz = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<NewQuizFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      questoes: [],
    },
  });

  const mutation = useCreateQuiz();

  const onSubmit = (data: NewQuizFormData) => {
    mutation.mutate(data);
  };

  const defaultQuestion: NewQuizFormData['questoes'][number] = {
    titulo: '',
    alternativas: ['', ''],
    correctIndex: 0,
  };

  const questions = watch('questoes');
  type SetQuestions = (
    p: NewQuizFormData['questoes']
  ) => NewQuizFormData['questoes'];
  const setQuestions = (args: NewQuizFormData['questoes'] | SetQuestions) => {
    if (typeof args === 'function') {
      setValue('questoes', args(questions));
      return;
    }
    setValue('questoes', args);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, defaultQuestion]);
    // trigger('questions');
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prev => [
      ...prev.slice(0, questionIndex),
      ...prev.slice(questionIndex + 1),
    ]);
    trigger('questoes');
  };

  const addAlternative = (questionIndex: number) => {
    setQuestions(prev => {
      const question = prev[questionIndex];
      const newQuestion = {
        ...question,
        alternativas: [...question.alternativas, ''],
      };
      return [
        ...prev.slice(0, questionIndex),
        newQuestion,
        ...prev.slice(questionIndex + 1),
      ];
    });
    trigger(`questoes.${questionIndex}.alternativas`);
  };

  const removeAlternative = (
    questionIndex: number,
    alternativeIndex: number
  ) => {
    setQuestions(prev => {
      const question = prev[questionIndex];
      const newQuestion = {
        ...question,
        alternativas: [
          ...question.alternativas.slice(0, alternativeIndex),
          ...question.alternativas.slice(alternativeIndex + 1),
        ],
      };
      return [
        ...prev.slice(0, questionIndex),
        newQuestion,
        ...prev.slice(questionIndex + 1),
      ];
    });
    trigger(`questoes.${questionIndex}.alternativas`);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    const questionIndex = Number(nameParts[1]);
    const question = questions[questionIndex];

    if (nameParts[2] === 'titulo') {
      setQuestions([
        ...questions.slice(0, questionIndex),
        {
          ...question,
          titulo: value,
        },
        ...questions.slice(questionIndex + 1),
      ]);
      trigger(`questoes.${questionIndex}.titulo`);
      return;
    } else if (nameParts[2] === 'alternativas') {
      const alternativeIndex = Number(nameParts[3]);

      if (nameParts?.[4] === undefined) {
        setQuestions([
          ...questions.slice(0, questionIndex),
          {
            ...question,
            alternativas: [
              ...question.alternativas.slice(0, alternativeIndex),
              value,
              ...question.alternativas.slice(alternativeIndex + 1),
            ],
          },
          ...questions.slice(questionIndex + 1),
        ]);
        trigger(`questoes.${questionIndex}.alternativas.${alternativeIndex}`);
        return;
      } else if (nameParts[4] === 'correctIndex') {
        setQuestions([
          ...questions.slice(0, questionIndex),
          {
            ...question,
            correctIndex: alternativeIndex,
          },
          ...questions.slice(questionIndex + 1),
        ]);
        trigger(`questoes.${questionIndex}.alternativas.${alternativeIndex}`);
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
            {...register('nome')}
            placeholder="Pesquisa do Evento X"
            className="border-2 border-gray-300"
          />
          {errors.nome && <span>{errors.nome.message}</span>}
        </label>
        <div>
          <h2>2. Adicione questões da sua pesquisa:</h2>
          {errors.questoes && <span>{errors.questoes.message}</span>}
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <div className="flex gap-2">
              <h3>{`${questionIndex + 1}. `}</h3>
              <div className="flex flex-col">
                <input
                  type="text"
                  name={`questoes.${questionIndex}.titulo`}
                  placeholder="Você gostou do evento?"
                  className="border-b-2 border-gray-300"
                  value={question.titulo}
                  onChange={handleFormChange}
                />
                {errors.questoes?.[questionIndex]?.titulo && (
                  <span>
                    {errors.questoes?.[questionIndex]?.titulo?.message}
                  </span>
                )}
              </div>
              <div>
                <Button.Primary onClick={() => removeQuestion(questionIndex)}>
                  -
                </Button.Primary>
              </div>
            </div>
            <div>
              {question.alternativas.map((alternative, alternativeIndex) => (
                <div
                  key={questionIndex + '.' + alternativeIndex}
                  className="flex gap-2"
                >
                  <h4>
                    {questionIndex + 1}.{alternativeIndex + 1}.{' '}
                  </h4>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder={`Sim, não, talvez...`}
                      className="rounded-md border-b-2 border-gray-300"
                      name={`questoes.${questionIndex}.alternativas.${alternativeIndex}`}
                      value={alternative}
                      onChange={handleFormChange}
                    />
                    {errors.questoes?.[questionIndex]?.alternativas?.[
                      alternativeIndex
                    ] && (
                      <span>
                        {
                          errors.questoes?.[questionIndex]?.alternativas?.[
                            alternativeIndex
                          ]?.message
                        }
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    name={`questoes.${questionIndex}.alternativas.${alternativeIndex}.correctIndex`}
                    checked={alternativeIndex === question.correctIndex}
                    onChange={handleFormChange}
                  />
                  <div>
                    <Button.Primary
                      onClick={() =>
                        removeAlternative(questionIndex, alternativeIndex)
                      }
                    >
                      -
                    </Button.Primary>
                  </div>
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
