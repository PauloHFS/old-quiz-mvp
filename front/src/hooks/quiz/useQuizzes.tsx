import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

export type QuizzesResponse = {
  data: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    skip: number;
    take: number;
    count: number;
  };
};

export const useQuizzes = () =>
  useInfiniteQuery({
    queryKey: ['quizzes'],
    queryFn: ({ pageParam }) =>
      apiClient
        .get<QuizzesResponse>('/quiz', {
          params: {
            skip: pageParam,
            take: 10,
          },
        })
        .then(res => res.data),
    initialPageParam: 0,
    getNextPageParam: ({ meta: { skip, take, count } }) =>
      skip + take < count ? skip + take : undefined,
    getPreviousPageParam: ({ meta: { skip, take } }) =>
      skip - take >= 0 ? skip - take : undefined,
  });
