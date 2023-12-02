import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

type QuizStatsResponse = {
  total: number;
  genderTotal: {
    female: number;
    male: number;
  };
  ageTotal: {
    [age: string]: number;
  };
  geoTotal: string[];
  questionTotal: Array<{
    questionTitle: string;
    alternatives: Array<{
      alternative: string;
      count: number;
      correct: boolean;
    }>;
  }>;
};

export const useQuizStats = (quizId: string) => {
  return useQuery({
    queryKey: ['quizStats', quizId],
    queryFn: () =>
      apiClient
        .get<QuizStatsResponse>(`/quiz/${quizId}/stats`)
        .then(res => res.data),
  });
};
