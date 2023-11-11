import { MouseEventHandler } from 'react';
import { QuizzesResponse } from '../hooks/quiz/useQuizzes';

interface QuizCardProps {
  data: QuizzesResponse[number];
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  data: { id, name },
  onClick,
}) => {
  return (
    <div
      key={id}
      onClick={onClick}
      className="border-solid border-2 border-gray-600 p-3 rounded-lg cursor-pointer hover:border-gray-300"
    >
      <h3>{name}</h3>
    </div>
  );
};
