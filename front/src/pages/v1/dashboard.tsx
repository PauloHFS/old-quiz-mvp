import { TbEdit, TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { PassTime } from '../../components/PassTime';
import { useQuizzes } from '../../hooks/quiz/useQuizzes';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, fetchNextPage, fetchPreviousPage } = useQuizzes();

  const onQuizCardClick = (id: number) => () => navigate(`/v1/quiz/${id}`);

  // TODO Create a componente to do a infinite scroll
  return (
    <main className="flex flex-col gap-4">
      <table className="w-full">
        <thead className="border-gray-500 border-2">
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
                <td className="text-center">{quiz.id}</td>
                <td className="text-center">{quiz.name}</td>
                <td className="text-center">
                  <PassTime time={quiz.createdAt} />
                </td>
                <td className="text-center">
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
      <div className="flex justify-center items-baseline gap-8">
        <Button onClick={() => fetchPreviousPage()}>{'<'}</Button>
        <p>{data?.pageParams}</p>
        <Button onClick={() => fetchNextPage()}>{'>'}</Button>
      </div>
    </main>
  );
};
