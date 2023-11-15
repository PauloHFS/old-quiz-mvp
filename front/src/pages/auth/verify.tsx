import { useNavigate, useSearchParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useVerifyToken } from '../../hooks/auth/useVerify';

export const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const mutation = useVerifyToken({
    onSuccess: () => {
      toast.success(
        'Conta verificada com sucesso! Faça login para continuar.',
        {
          position: 'bottom-center',
        }
      );
      navigate('/login');
    },
  });

  const token = searchParams.get('token');

  if (token === null || token === '') {
    navigate('/');
    return null;
  }

  mutation.mutate({ token });

  return (
    <main className="h-screen flex flex-1 justify-center items-center">
      {mutation.isPending && <SyncLoader />}
      {mutation.isError && <p>Erro ao verificar conta!</p>}
    </main>
  );
};
