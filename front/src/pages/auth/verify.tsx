import { useEffect } from 'react';
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
      navigate('/auth');
    },
  });

  const token = searchParams.get('token');

  const isTokenInvalid = token === null || token === '';

  useEffect(() => {
    if (!isTokenInvalid) {
      mutation.mutate({ token });
    }
  }, [token]);

  if (isTokenInvalid) {
    navigate('/');
    return null;
  }

  return (
    <main className="h-screen flex flex-1 justify-center items-center">
      {mutation.isPending && <SyncLoader />}
      {mutation.isError && <p>Erro ao verificar conta!</p>}
    </main>
  );
};
