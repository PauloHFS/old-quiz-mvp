import { useNavigate, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { Button } from '../../components/Button';
import { QuizStats } from '../../components/QuizStats';
import { classNames } from '../../components/utils';
import { useQuiz } from '../../hooks/quiz/useQuiz';

export const QuizDetails = () => {
  const { quizId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useQuiz(quizId || '');

  if (isLoading)
    return (
      <main>
        <SyncLoader />
      </main>
    );

  if (!data)
    return (
      <main>
        <h2>Quiz não encontrado!</h2>
      </main>
    );

  const handlePreview = () => {
    navigate('/v1/quiz/' + quizId + '/preview');
  };

  return (
    <main>
      <div className="flex justify-center">
        <h2>{data.name}</h2>
      </div>
      <div>
        <Button onClick={handlePreview}>Preview</Button>
      </div>
      <h2>Questões:</h2>
      <div className="flex flex-wrap gap-4">
        {data.Questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="border-2 border-gray-300 rounded-md py-2 px-4"
          >
            <h3>
              {questionIndex + 1}. {question.title}
            </h3>
            <div>
              {question.alternatives.map((alternative, alternativeIndex) => (
                <li
                  key={alternative + alternativeIndex}
                  className={classNames({
                    'text-green-500':
                      alternativeIndex === question.correctIndex,
                  })}
                >
                  {alternative}
                </li>
              ))}
            </div>
          </div>
        ))}
      </div>
      <QuizStats quizId={quizId || ''} />
    </main>
  );
};
