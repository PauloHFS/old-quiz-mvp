import { useNavigate, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useQuiz } from '../../hooks/quiz/useQuiz';
import { Steps } from './components/Steps';

interface ResponseProps {
  preview?: boolean;
}

export const Response: React.FC<ResponseProps> = ({ preview = false }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  if (quizId === undefined || quizId === '') navigate('/');

  const { data, isLoading, isError } = useQuiz(quizId || '');

  const handleError = () => {
    toast.error('Erro ao carregar o quiz');
    navigate('/');
  };

  if (isLoading)
    return (
      <main>
        <SyncLoader />
      </main>
    );

  if (isError) {
    handleError();
    return null; // only to be accepted as a route
  }
  if (data === undefined) {
    handleError();
    return null; // only to be accepted as a route
  }

  return <Steps quiz={data} preview={preview} />;
};
