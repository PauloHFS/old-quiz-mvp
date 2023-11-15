import { createBrowserRouter, redirect } from 'react-router-dom';
import { authRoutes } from './auth';
import { Logout } from './auth/logout';
import { Home } from './home';
import { Response } from './response';
import { Root } from './root';
import { v1Routes } from './v1';
import { V1Layout } from './v1/layout';

const hasSession = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return accessToken && refreshToken;
};

const redirectIfNotAuthenticated = async () => {
  if (!hasSession()) return redirect('/auth');
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        children: authRoutes,
        loader: async () => {
          if (hasSession()) return redirect('/v1');
          return null;
        },
      },
      {
        path: 'v1',
        element: <V1Layout />,
        loader: redirectIfNotAuthenticated,
        children: v1Routes,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: '/:quizId',
        element: <Response />,
      },
    ],
  },
]);
