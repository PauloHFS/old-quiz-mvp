import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const onCreateNewQuizPress = () => navigate('/v1/new-quiz');

  const mutation = useLogout();

  const handleLogout = () => {
    mutation.mutate();
    navigate('/');
  };

  return (
    <main>
      <button
        type="button"
        className="bg-green-500"
        onClick={onCreateNewQuizPress}
      >
        Criar Novo Quiz
      </button>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </main>
  );
};
