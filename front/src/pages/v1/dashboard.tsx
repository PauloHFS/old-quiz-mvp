import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const onCreateNewQuizPress = () => navigate('/v1/new-quiz');

  return (
    <main>
      <button
        type="button"
        className="bg-green-500"
        onClick={onCreateNewQuizPress}
      >
        Criar Novo Quiz
      </button>
    </main>
  );
};
