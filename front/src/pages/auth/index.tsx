import { RouteObject } from 'react-router-dom';
import { Login } from './login';
import { SignUp } from './signup';

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: 'signup',
    element: <SignUp />,
  },
];
