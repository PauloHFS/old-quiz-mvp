import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/Button';

const schema = z.object({
  name: z.string().min(1),
  questions: z
    .array(
      z.object({
        title: z.string().min(1, 'A questão está vazia!'),
        alternatives: z
          .array(z.string().min(1, 'A alternativa está vazia!'))
          .min(2)
          .max(4),
        correctID: z.number().int(),
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
      name: '',
      questions: [],
    },
  });

  const onSubmit = (data: NewQuizFormData) => {
    console.log(data);
  };

  const defaultQuestion = {
    title: '',
    alternatives: ['', ''],
    correctID: 0,
  };

  const questions = watch('questions');
  type SetQuestions = (
    p: NewQuizFormData['questions']
  ) => NewQuizFormData['questions'];
  const setQuestions = (args: NewQuizFormData['questions'] | SetQuestions) => {
    if (typeof args === 'function') {
      setValue('questions', args(questions));
      return;
    }
    setValue('questions', args);
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
    trigger('questions');
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
    trigger(`questions.${questionIndex}.alternatives`);
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
    trigger(`questions.${questionIndex}.alternatives`);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const nameParts = name.split('.');
    console.log(nameParts);

    const questionIndex = Number(nameParts[1]);
    const question = questions[questionIndex];

    if (nameParts[2] === 'title') {
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
      trigger(`questions.${questionIndex}.title`);
      return;
    } else if (nameParts[2] === 'alternatives') {
      const alternativeIndex = Number(nameParts[3]);

      if (nameParts?.[4] === undefined) {
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
        trigger(`questions.${questionIndex}.alternatives`);
        return;
      } else if (nameParts[4] === 'correctID') {
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
        trigger(`questions.${questionIndex}.alternatives`);
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
          {errors.questions && <span>{errors.questions.message}</span>}
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <div className="flex gap-2">
              <h3>{`${questionIndex + 1}. `}</h3>
              <div className="flex flex-col">
                <input
                  type="text"
                  name={`questions.${questionIndex}.title`}
                  placeholder="Você gostou do evento?"
                  className="border-b-2 border-gray-300"
                  value={question.title}
                  onChange={handleFormChange}
                />
                {errors.questions?.[questionIndex]?.title && (
                  <span>
                    {errors.questions?.[questionIndex]?.title?.message}
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
              {question.alternatives.map((alternative, alternativeIndex) => (
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
                      name={`questions.${questionIndex}.alternatives.${alternativeIndex}`}
                      value={alternative}
                      onChange={handleFormChange}
                    />
                    {errors.questions?.[questionIndex]?.alternatives?.[
                      alternativeIndex
                    ] && (
                      <span>
                        {
                          errors.questions?.[questionIndex]?.alternatives?.[
                            alternativeIndex
                          ]?.message
                        }
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    name={`questions.${questionIndex}.alternatives.${alternativeIndex}.correctID`}
                    checked={alternativeIndex === question.correctID}
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
