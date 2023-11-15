import { RouteObject } from 'react-router-dom';
import { Login } from './login';
import { SignUp } from './signup';
import { Verify } from './verify';

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: 'signup',
    element: <SignUp />,
  },
  {
    path: 'verify',
    element: <Verify />,
  },
];
