import { RadioGroup } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../../components/Button';
import { classNames } from '../../../components/utils';
import { QuizResponse } from '../../../hooks/quiz/useQuiz';
import { BrasilDictionary } from '../../../services/brasil';

const genders = [
  'Masculino',
  'Feminino',
  'Não-binário',
  'Prefiro não informar',
];

const estados = BrasilDictionary.map(estado => estado.nome);

const formSchema = z.object({
  quizId: z.number(),
  userData: z.object({
    gender: z
      .string()
      .refine(
        gender => gender !== '-- escolha um gênero --',
        'Escolha um gênero'
      ),
    age: z
      .string()
      .min(1, 'Idade é obrigatório')
      .transform(Number)
      .refine(age => age >= 0 || age <= 100, {
        message: 'Idade precisa está entre 0 e 100',
      }),
    state: z
      .string()
      .refine(
        state => state !== '-- escolha um estado --',
        'Escolha um estado'
      ),
    city: z
      .string()
      .refine(
        city => city !== '-- escolha uma cidade --',
        'Escolha uma cidade'
      ),
  }),
  responses: z.array(
    z.object({
      questionId: z.number().min(1),
      alternativa: z.string().min(1),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface StepsProps {
  quiz: QuizResponse;
}

export const Steps: React.FC<StepsProps> = ({ quiz }) => {
  const [step, setStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);
  const nextQuestion = () => setQuestionIndex(prev => prev + 1);

  const {
    register,
    watch,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizId: quiz.id,
      responses: [],
      userData: {
        age: undefined,
        gender: '-- escolha um gênero --',
        state: '-- escolha um estado --',
        city: '-- escolha uma cidade --',
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setStep(2);
    setTimeout(() => {
      reset();
      setStep(0);
      setQuestionIndex(0);
    }, 5 * 1000);
  };

  const prepareResponse = (index: number) => {
    if (index >= quiz.Question.length) return;

    setValue(`responses.${index}`, {
      alternativa: '',
      questionId: quiz.Question[index].id,
    });
  };

  const handleSaveUserData = () => {
    trigger('userData').then(isValid => {
      if (isValid) {
        prepareResponse(0);
        nextStep();
      }
    });
  };

  const handleSaveResponse = () => {
    trigger(`responses.${questionIndex}`).then(isValid => {
      if (isValid) {
        prepareResponse(questionIndex + 1);

        if (questionIndex >= quiz.Question.length - 1) handleSubmit(onSubmit)();
        else nextQuestion();
      }
    });
  };

  return (
    <main className="h-screen bg-green-300 p-4">
      <form className="px-4 py-8 rounded-lg bg-white">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-center">
                Antes de começar,
                <br />
                <b>preencha as informações abaixo:</b>
              </p>
            </div>
            <label htmlFor="userData.gender" className="flex flex-col gap-2">
              Gênero
              <select {...register('userData.gender')}>
                <option disabled>-- escolha um gênero --</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.userData?.gender && (
                <span>{errors.userData?.gender.message}</span>
              )}
            </label>

            <label htmlFor="userData.age" className="flex flex-col">
              Idade
              <input
                type="number"
                {...register('userData.age')}
                min={0}
                max={100}
              />
              {errors.userData?.age && (
                <span>{errors.userData?.age.message}</span>
              )}
            </label>

            <label htmlFor="userData.state" className="flex flex-col">
              Estado
              <select {...register('userData.state')}>
                <option disabled>-- escolha um estado --</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.userData?.state && (
                <span>{errors.userData?.state.message}</span>
              )}
            </label>

            <label htmlFor="userData.city" className="flex flex-col">
              Cidade
              <select {...register('userData.city')}>
                <option disabled>-- escolha uma cidade --</option>
                {BrasilDictionary.find(
                  estado => estado.nome === watch('userData.state')
                )?.cidades.map(cidade => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
              {errors.userData?.city && (
                <span>{errors.userData?.city.message}</span>
              )}
            </label>

            <div className="flex justify-center">
              <Button.Primary onClick={handleSaveUserData}>
                Próximo
              </Button.Primary>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <RadioGroup
              value={watch(`responses.${questionIndex}.alternativa`)}
              onChange={value => {
                setValue(`responses.${questionIndex}.alternativa`, value);
                trigger(`responses.${questionIndex}.alternativa`);
              }}
            >
              <RadioGroup.Label>
                {quiz.Question[questionIndex].title}
              </RadioGroup.Label>
              {quiz.Question[questionIndex].alternatives.map(alternativa => (
                <RadioGroup.Option key={alternativa} value={alternativa}>
                  {({ checked }) => (
                    <span className={classNames({ 'bg-blue-400': checked })}>
                      {alternativa}
                    </span>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
            {errors.responses?.[questionIndex]?.alternativa?.message && (
              <span>
                {errors.responses?.[questionIndex]?.alternativa?.message}
              </span>
            )}
            <div className="flex justify-center">
              <Button.Primary onClick={handleSaveResponse}>
                {questionIndex === quiz.Question.length - 1
                  ? 'Finalizar'
                  : 'Próximo'}
              </Button.Primary>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="text-center">
              Obrigado por responder o quiz!
              <br />
              <b>Seus dados foram salvos com sucesso!</b>
            </p>
          </div>
        )}
      </form>
    </main>
  );
};
