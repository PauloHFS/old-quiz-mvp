import { RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard';

export const v1Routes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
];
