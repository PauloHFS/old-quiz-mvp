import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { QuizCard } from '../../components/QuizCard';
import { useQuizzes } from '../../hooks/quiz/useQuizzes';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useQuizzes();

  const onCreateNewQuizPress = () => navigate('/v1/new-quiz');

  const onQuizCardClick = (id: number) => () => navigate(`/v1/quiz/${id}`);

  return (
    <main>
      <Button.Primary onClick={onCreateNewQuizPress}>Criar Quiz</Button.Primary>
      <div className="p-8 flex flex-wrap gap-8">
        {data?.pages.map(page => (
          <>
            {page.data.map(quiz => (
              <QuizCard data={quiz} onClick={onQuizCardClick(quiz.id)} />
            ))}
          </>
        ))}
      </div>
    </main>
  );
};
