import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

export type QuizzesResponse = Array<{
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export const useQuizzes = () =>
  useInfiniteQuery({
    queryKey: ['quizzes'],
    queryFn: ({ pageParam }) =>
      apiClient
        .get<QuizzesResponse>('/quiz', {
          params: {
            page: pageParam,
          },
        })
        .then(res => res.data),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.length + 1,
  });
