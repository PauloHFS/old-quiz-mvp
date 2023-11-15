import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { classNames } from '../../components/utils';
import { signUpSchema } from '../../hooks/auth/useSignUp';

const signUpFormSchema = signUpSchema
  .extend({
    passwordConfirmation: z.string(),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  });

type SignUpFormParams = z.infer<typeof signUpFormSchema>;

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormParams>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = data => {
    console.log(data);
  };

  return (
    <main className="h-screen p-4 bg-green-200 md:flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl p-4 bg-white flex flex-1 flex-col gap-4 md:max-w-3xl"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="nome">Nome:</label>
          <input
            {...register('nome')}
            placeholder="Nome"
            className={classNames('rounded-md py-1 px-2 border', {
              'border-2 border-red-600': errors.nome?.message,
            })}
          />
          {errors.nome && (
            <span className="text-red-600">{errors.nome.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email:</label>
          <input {...register('email')} placeholder="Email" />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha:</label>
          <input
            {...register('password')}
            type="password"
            placeholder="Senha"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="passwordConfirmation">Confirme sua Senha:</label>
          <input
            {...register('passwordConfirmation')}
            type="password"
            placeholder="Confirmar Senha"
          />
          {errors.passwordConfirmation && (
            <span>{errors.passwordConfirmation.message}</span>
          )}
        </div>
        <Button.Primary type="submit">Cadastrar</Button.Primary>
      </form>
    </main>
  );
};
