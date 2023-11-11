import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

type Response = {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  Question: {
    id: number;
    quizId: number;
    title: string;
    alternatives: string[];
    correctIndex: number;
    createdAt: string;
    updatedAt: string;
  }[];
};

export const useQuiz = (quizId: string) =>
  useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () =>
      apiClient.get<Response>(`/quiz/${quizId}`).then(res => res.data),
  });
