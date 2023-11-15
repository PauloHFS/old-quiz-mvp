import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../services/api';

export const useLogout = (options?: UseMutationOptions) =>
  useMutation({
    mutationFn: () =>
      apiClient
        .post('/auth/logout', {
          refreshToken: localStorage.getItem('refreshToken'),
        })
        .then(res => res.data),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    retry: false,
    ...options,
  });
