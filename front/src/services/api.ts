import axios from 'axios';
import { redirect } from 'react-router-dom';

import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    if (config.url?.includes('auth')) {
      return config;
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

let refreshing = false;

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log(error);

    if (error.response.status !== 401) return error;
    if (refreshing) return error;

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      redirect('/login');
    }

    refreshing = true;
    apiClient
      .post('/auth/refresh-token', {
        refreshToken,
      })
      .then(res => {
        localStorage.setItem('accessToken', res.data.accessToken);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        redirect('/auth');
      })
      .finally(() => {
        refreshing = false;
      });

    return Promise.reject(error);
  }
);
