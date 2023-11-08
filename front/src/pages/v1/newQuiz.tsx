import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QuestionForm } from '../../components/QuestionForm';

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

    // Need to create a function to send data on RPC to supabase
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center flex-col items-center space-y-4"
      >
        <label htmlFor="name" className="flex flex-col">
          Nome do Quiz:
          <input {...register('name')} />
          {errors.name && <span>This field is required</span>}
        </label>
        <QuestionForm />
        <button type="submit">Criar</button>
      </form>
    </main>
  );
};
