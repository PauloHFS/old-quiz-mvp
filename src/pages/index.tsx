import { createBrowserRouter, redirect } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { AuthPage } from './auth';
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
        element: <AuthPage />,
        loader: async () => {
          const session = await supabase.auth.getSession();
          if (session) return redirect('/v1');
          return null;
        },
      },
      {
        path: 'v1',
        children: v1Routes,
      },
    ],
  },
]);
