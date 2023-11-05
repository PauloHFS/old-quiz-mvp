import { createBrowserRouter, redirect } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { AuthPage } from './auth';
import { Home } from './home';
import { Root } from './root';
import { v1Routes } from './v1';

const hasSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || data.session === null) return false;
  return true;
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
      {
        path: 'auth',
        element: <AuthPage />,
        loader: async () => {
          if (await hasSession()) return redirect('/v1');
          return null;
        },
      },
      {
        path: 'logout',
        action: () => {
          supabase.auth.signOut();
          return redirect('/');
        },
      },
      {
        path: 'v1',
        loader: redirectIfNotAuthenticated,
        children: v1Routes,
      },
    ],
  },
]);
