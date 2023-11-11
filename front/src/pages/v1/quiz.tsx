import { useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { useQuiz } from '../../hooks/quiz/useQuiz';

export const QuizDetails = () => {
  // TODO: implement this page
  // get id from router

  const { quizId } = useParams();

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

  return (
    <main>
      <h2>{data.name}</h2>
      <div>
        {data.Question.map(question => (
          <div>
            <h3>{question.title}</h3>
            <ul>
              {question.alternatives.map(alternative => (
                <li>{alternative}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};
