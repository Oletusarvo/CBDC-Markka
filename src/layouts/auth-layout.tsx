import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { LogOut } from 'lucide-react';
import { useSession } from '../providers/auth-provider';

export function AuthLayout() {
  const { session } = useSession();
  const navigate = useNavigate();
  const logout = () => navigate('/auth/logout');

  if (!session) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <main className='flex flex-col w-full flex-1 h-full overflow-y-scroll'>
        <Outlet />
      </main>
    </div>
  );
}
