import { Auth } from '@supabase/auth-ui-react';
import { ThemeMinimal } from '@supabase/auth-ui-shared';
import { supabase } from '../services/supabase';

// https://supabase.com/docs/guides/auth/auth-helpers/auth-ui
export const AuthPage = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeMinimal,
      }}
      providers={[]}
      localization={{
        variables: {
          sign_in: {
            button_label: 'Acessar',
            email_label: 'Email',
            password_label: 'Senha',
            password_input_placeholder: '********',
            email_input_placeholder: 'josé@gmail.com',
            loading_button_label: 'Carregando...',
          },
          sign_up: {
            button_label: 'Cadastrar',
            email_label: 'Email',
            email_input_placeholder: 'josé@gmail.com',
            password_label: 'Escolha sua melhor senha',
            password_input_placeholder: '********',
            confirmation_text: 'Já tem uma conta?',
            loading_button_label: 'Carregando...',
          },
          forgotten_password: {
            button_label: 'Enviar',
            email_label: 'Email',
            email_input_placeholder: 'josé@gmail.com',
          },
        },
      }}
    />
  );
};
