import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

export const useQuiz = (quizId: number) =>
  useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => apiClient.get(`/quiz/${quizId}`).then(res => res.data),
  });
