import { useNavigate } from 'react-router-dom';
import { useQuizzes } from '../../hooks/quiz/useQuizzes';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useQuizzes();

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
      <div>
        {data?.pages.map(page => (
          <ul>
            {page.map(quiz => (
              <li
                onClick={() => {
                  navigate(`/v1/quiz/${quiz.id}`);
                }}
              >
                {quiz.name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </main>
  );
};
