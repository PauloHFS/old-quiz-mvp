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

const schema2 = z.array(
  z.object({
    title: z.string().min(1),
    alternatives: z.array(z.string().min(1)),
    correctID: z.number().int().min(0),
  })
);

type NewQuizFormData = z.infer<typeof schema>;
type QuestionFormData = z.infer<typeof schema2>;

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

    // Need to create a function to send data on RPC to supabase
  };

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionFormData>([]);

  const [alternativa, setAlternativa] = useState<{
    title: string;
    correct: boolean;
  }>({
    title: '',
    correct: false,
  });
  const [alternativas, setAlternativas] = useState<string[]>([]);

  const handleAddAlternative = () => {
    setAlternativas(prev => [...prev, alternativa.title]);
    setAlternativa({ title: '', correct: false });
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { title, alternatives: alternativas, correctID: 0 },
    ]);
    setTitle('');
    setAlternativas([]);
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="name" className="flex flex-col">
          1. Adicione o nome do seu quiz:
          <input {...register('name')} />
          {errors.name && <span>{errors.name.message}</span>}
        </label>
        <div className="border-2 border-black p-5">
          <h2>Questões</h2>
          <div>
            <label htmlFor="title" className="flex flex-col">
              2. Adiciona o titulo da questão:
              <input
                type="text"
                value={title}
                placeholder="Você conhece nossa empresa?"
                onChange={e => setTitle(e.target.value)}
              />
            </label>
            <label htmlFor="alternatives" className="flex flex-col">
              3. Adicione as alternativas:
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="alternative" className="flex flex-col">
                  3.1 Adicione uma alternativa:
                  <input
                    type="text"
                    value={alternativa.title}
                    placeholder="Sim"
                    onChange={e => {
                      setAlternativa(prev => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                </label>
                <label htmlFor="correct">
                  3.2 É a alternativa correta?
                  <input
                    type="checkbox"
                    checked={alternativa.correct}
                    onChange={() => {
                      setAlternativa(prev => ({
                        ...prev,
                        correct: !prev.correct,
                      }));
                    }}
                  />
                </label>
                <Button.Primary type="button" onClick={handleAddAlternative}>
                  +
                </Button.Primary>
              </div>
              <div className="flex p-3">
                {alternativas.map(alt => (
                  <div key={alt} className="flex items-baseline gap-4">
                    <p>{alt}</p>
                    <Button.Primary type="button">-</Button.Primary>
                  </div>
                ))}
              </div>
            </label>
            <Button.Primary type="button" onClick={handleAddQuestion}>
              Adicionar Questão
            </Button.Primary>
          </div>
          {questions.map(({ title, alternatives }, index) => (
            <div key={title}>
              <h3>
                {index + 1}. {title}
              </h3>
              <ul>
                {alternatives.map(alt => (
                  <li key={alt}>{alt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button.Primary type="submit">Criar Quiz</Button.Primary>
      </form>
    </main>
  );
};
