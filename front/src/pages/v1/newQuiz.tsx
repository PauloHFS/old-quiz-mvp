import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbTrash } from 'react-icons/tb';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
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
  const [image, setImage] = useState();

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
    // trigger('questoes');
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prev => [
      ...prev.slice(0, questionIndex),
      ...prev.slice(questionIndex + 1),
    ]);
    // trigger('questoes');
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
    // trigger(`questoes.${questionIndex}.alternativas`);
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
    // trigger(`questoes.${questionIndex}.alternativas`);
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
    <main className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Container>
          <Input.Label>1. Adicione o nome do seu quiz:</Input.Label>
          <Input.Component
            type="text"
            placeholder="Pesquisa do Evento X"
            {...register('nome')}
          />
          <Input.Error hasError={!!errors.nome}>
            {errors.nome?.message}
          </Input.Error>
        </Input.Container>
        <div>
          <label
            htmlFor="alternativeImage"
            className="border p-2 rounded-lg hover:bg-slate-200"
          >
            Adicionar imagem de fundo
            <input
              type="file"
              name="alternativeImage"
              id="alternativeImage"
              accept=".png"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = e => {
                    setImage(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          {image && <img src={image} />}
        </div>
        <div className="flex items-baseline gap-8">
          <div>
            <h2>2. Adicione questões da sua pesquisa:</h2>
            <Input.Error hasError={!!errors.questoes}>
              {errors.questoes?.message}
            </Input.Error>
          </div>
          <Button variant="secondary" onClick={addQuestion}>
            Criar Questão
          </Button>
        </div>
        <div className="w-full flex flex-wrap gap-8 justify-center ">
          {questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="flex flex-col h-fit gap-2 p-4 border border-gray-600 rounded-lg"
            >
              <div className="flex justify-between">
                <Input.Container>
                  <Input.Label>
                    {`${questionIndex + 1}. `}
                    <Input.Component
                      type="text"
                      name={`questoes.${questionIndex}.titulo`}
                      placeholder="Você gostou do evento?"
                      value={question.titulo}
                      onChange={handleFormChange}
                    />
                  </Input.Label>
                  <Input.Error
                    hasError={!!errors.questoes?.[questionIndex]?.titulo}
                  >
                    {errors.questoes?.[questionIndex]?.titulo?.message}
                  </Input.Error>
                </Input.Container>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <TbTrash />
                  </Button>
                </div>
              </div>
              {question.alternativas.map((alternative, alternativeIndex) => (
                <Input.Container key={questionIndex + '.' + alternativeIndex}>
                  <Input.Label className="flex flex-wrap gap-2">
                    {questionIndex + 1}.{alternativeIndex + 1}.{' '}
                    <Input.Component
                      type="text"
                      placeholder={`Sim, não, talvez...`}
                      name={`questoes.${questionIndex}.alternativas.${alternativeIndex}`}
                      value={alternative}
                      onChange={handleFormChange}
                    />
                    <input
                      type="radio"
                      name={`questoes.${questionIndex}.alternativas.${alternativeIndex}.correctIndex`}
                      checked={alternativeIndex === question.correctIndex}
                      onChange={handleFormChange}
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        removeAlternative(questionIndex, alternativeIndex)
                      }
                    >
                      <TbTrash />
                    </Button>
                  </Input.Label>
                  <Input.Error
                    hasError={
                      !!errors.questoes?.[questionIndex]?.alternativas?.[
                        alternativeIndex
                      ]
                    }
                  >
                    {
                      errors.questoes?.[questionIndex]?.alternativas?.[
                        alternativeIndex
                      ]?.message
                    }
                  </Input.Error>
                </Input.Container>
              ))}
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => addAlternative(questionIndex)}
                >
                  Adicionar Alternativa
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="self-center">
          <Button type="submit">Criar Quiz</Button>
        </div>
      </form>
    </main>
  );
};
