import { Outlet } from 'react-router-dom';

export const Root: React.FC = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};
