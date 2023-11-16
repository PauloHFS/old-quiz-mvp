import { TbEdit, TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { PassTime } from '../../components/PassTime';
import { useQuizzes } from '../../hooks/quiz/useQuizzes';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useQuizzes();

  const onCreateNewQuizPress = () => navigate('/v1/new-quiz');

  const onQuizCardClick = (id: number) => () => navigate(`/v1/quiz/${id}`);

  // TODO Create a componente to do a infinite scroll
  return (
    <main>
      <Button.Primary onClick={onCreateNewQuizPress}>Criar Quiz</Button.Primary>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Data de Criação</th>
            <th>Última Alteração</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map(page =>
            page.data.map(quiz => (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>{quiz.name}</td>
                <td>
                  <PassTime time={quiz.createdAt} />
                </td>
                <td>
                  <PassTime time={quiz.updatedAt} />
                </td>
                <td onClick={onQuizCardClick(quiz.id)}>
                  <TbEdit />
                </td>
                <td>
                  <TbTrash />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};
