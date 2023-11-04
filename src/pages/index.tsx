import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './auth';
import { Home } from './home';
import { Root } from './root';
import { v1Routes } from './v1';

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
      },
      {
        path: 'v1',
        children: v1Routes,
      },
    ],
  },
]);
