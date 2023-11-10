import { createBrowserRouter, redirect } from 'react-router-dom';
import { Home } from './home';
import { Root } from './root';
import { v1Routes } from './v1';
import { V1Layout } from './v1/layout';

// TODO: Implement this function
const hasSession = async () => {
  return false;
};

const redirectIfNotAuthenticated = async () => {
  if (!(await hasSession())) return redirect('/auth');
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
      // {
      //   path: 'auth',
      //   element: <AuthPage />,
      //   loader: async () => {
      //     if (await hasSession()) return redirect('/v1');
      //     return null;
      //   },
      // },
      {
        path: 'v1',
        element: <V1Layout />,
        loader: redirectIfNotAuthenticated,
        children: v1Routes,
      },
    ],
  },
]);
