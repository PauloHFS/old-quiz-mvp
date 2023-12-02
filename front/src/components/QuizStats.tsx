import { SyncLoader } from 'react-spinners';
import {
  VictoryBar,
  VictoryChart,
  VictoryHistogram,
  VictoryPie,
  VictoryTheme,
} from 'victory';
import { useQuizStats } from '../hooks/quiz/useQuizStats';

interface QuizStatsProps {
  quizId: string;
}

export const QuizStats: React.FC<QuizStatsProps> = ({ quizId }) => {
  const { data, isLoading } = useQuizStats(quizId);

  if (isLoading)
    return (
      <div>
        <SyncLoader />
      </div>
    );

  if (!data) {
    return (
      <div>
        <h2>Quiz não encontrado!</h2>
      </div>
    );
  }

  const { total, genderTotal, ageTotal, geoTotal, questionTotal } = data;

  const genderData = Object.entries(genderTotal).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  const ageData = Object.entries(ageTotal).flatMap(([age, length]) =>
    Array.from({ length }, () => ({ x: Number(age) }))
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h3>Total de respostas: {total}</h3>
      </div>
      <div>
        <div>
          <h3>Ranking de Cidade</h3>
        </div>
        <ol>
          {geoTotal.map((geo, index) => (
            <li key={index}>
              {index + 1}. {geo.split('-').join(' - ')}
            </li>
          ))}
        </ol>
      </div>
      <div className="max-w-xl">
        <h3>Gênero do Público</h3>
        {/* https://formidable.com/open-source/victory/docs/victory-pie */}
        <VictoryPie data={genderData} />
      </div>
      <div className="max-w-xl">
        <h3>Histograma de Idades</h3>
        {/* https://formidable.com/open-source/victory/docs/victory-histogram */}
        <VictoryChart domainPadding={10}>
          <VictoryHistogram data={ageData} />
        </VictoryChart>
      </div>
      {questionTotal.map(({ questionTitle, alternatives }, index) => (
        <div className="max-w-xl">
          <h3>
            Questão {index + 1}: {questionTitle}
          </h3>
          <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
            <VictoryBar
              data={alternatives.map((alternative, index) => ({
                x: index + 1,
                y: alternative.count,
                label: alternative.alternative,
              }))}
              labels={({ datum }) => `${datum.label}`}
            />
          </VictoryChart>
        </div>
      ))}
    </div>
  );
};
