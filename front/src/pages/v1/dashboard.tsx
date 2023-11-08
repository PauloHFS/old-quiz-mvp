import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Tables } from '../../services/supabase/utility.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [quizes, setQuizes] = useState<Array<Tables<'quiz'>>>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCreateNewQuizPress = () => navigate('/v1/new-quiz');

  useEffect(() => {
    let ignore = false;
    supabase
      .from('quiz')
      .select('*')
      .then(({ data, error }) => {
        if (!ignore) {
          if (error) {
            setError(true);
          } else {
            setQuizes(data);
          }
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      <button
        type="button"
        className="bg-green-500"
        onClick={onCreateNewQuizPress}
      >
        Criar Novo Quiz
      </button>
      {loading && <div>Loading ...</div>}
      {error && <div>Failed to fetch data.</div>}
      {quizes && (
        <div>
          <h1>Quizes</h1>
          <ul>
            {quizes.map(quiz => (
              <li key={quiz.id}>{quiz.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          supabase.auth.signOut().then(({ error }) => {
            if (error) {
              console.error(error);
            }
            navigate('/');
          });
        }}
      >
        Sair
      </button>
    </main>
  );
};
