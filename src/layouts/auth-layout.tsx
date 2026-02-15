import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { LogOut } from 'lucide-react';
import { useSession } from '../providers/auth-provider';
import { Spinner } from '../components/spinner';

export function AuthLayout() {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <Navigate to='/login' />;
  } else if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <main className='flex flex-col w-full flex-1 h-full overflow-y-scroll'>
        <Outlet />
      </main>
    </div>
  );
}
