import { RouteObject } from 'react-router-dom';
import { Login } from './login';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <h1>Signup</h1>,
  },
];
