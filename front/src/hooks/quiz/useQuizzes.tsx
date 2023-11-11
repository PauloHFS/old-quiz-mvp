import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

export const useQuizzer = () =>
  useInfiniteQuery({
    queryKey: ['quizzes'],
    queryFn: ({ pageParam }) =>
      apiClient
        .get('/quiz', {
          params: {
            page: pageParam,
          },
        })
        .then(res => res.data),
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextPage,
  });
