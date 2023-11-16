import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import zod from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useLogin } from '../../hooks/auth/useLogin';

const schema = zod.object({
  email: zod.string().email('Email Inválido'),
  password: zod
    .string()
    .min(8, 'Senha precisa ter no mínimo 8 caracteres')
    .max(100, 'Senha não pode ter mais de 100 caracteres'),
  remember: zod.boolean().optional(),
});

type FormValues = zod.infer<typeof schema>;

export const Login = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: localStorage.getItem('email') ?? '',
    },
  });

  const haveToRemember = watch('remember');

  const mutation = useLogin({
    onSuccess: ({ accessToken, refreshToken }, { email }) => {
      if (haveToRemember) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/v1');
    },
    onError: error => {
      console.log(error);
      alert('Erro ao fazer login');
    },
  });

  const onSubmit = ({ email, password }: FormValues) => {
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <main className="bg-green-300 h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-fit md:min-w-[600px] lg:min-w-[900px] p-8 flex flex-col gap-2 bg-white"
      >
        <Input.Container>
          <Input.Label htmlFor="email">E-mail</Input.Label>
          <Input.Component
            type="email"
            {...register('email')}
            placeholder="jose.silva@email.com"
          />
          <Input.Error hasError={!!errors.email}>
            {errors.email?.message}
          </Input.Error>
        </Input.Container>
        <Input.Container>
          <Input.Label htmlFor="password">Senha</Input.Label>
          <Input.Component
            type="password"
            {...register('password')}
            placeholder="********"
          />
          <Input.Error hasError={!!errors.password}>
            {errors.password?.message}
          </Input.Error>
        </Input.Container>
        <Input.Container>
          <Input.Label htmlFor="remember" className="flex gap-1">
            <Input.Component type="checkbox" {...register('remember')} />
            Lembrar e-mail
          </Input.Label>
        </Input.Container>
        <Button.Primary type="submit">Login</Button.Primary>
      </form>
    </main>
  );
};
