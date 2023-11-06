import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const Root: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        navigate('/v1', {
          replace: true,
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return <Outlet />;
};
