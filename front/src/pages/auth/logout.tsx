import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { useLogout } from '../../hooks/useLogout';

export const Logout = () => {
  const navigate = useNavigate();
  const mutation = useLogout();

  useEffect(() => {
    mutation.mutate();
    navigate('/');
  }, [navigate, mutation]);

  return (
    <main className="h-screen flex justify-center items-center">
      <SyncLoader />
    </main>
  );
};
