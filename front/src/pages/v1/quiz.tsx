import { useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { classNames } from '../../components/utils';
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
      <div className="flex justify-center">
        <h2>{data.name}</h2>
      </div>
      <h2>Questões:</h2>
      <div className="flex flex-wrap gap-4">
        {data.Question.map((question, questionIndex) => (
          <div className="border-2 border-gray-300 rounded-md py-2 px-4">
            <h3>
              {questionIndex + 1}. {question.title}
            </h3>
            <div>
              {question.alternatives.map((alternative, alternativeIndex) => (
                <li
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
    </main>
  );
};
