import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../providers/auth-provider';
import { LoadingScreen } from '../screen/loading-screen';

export function AuthLayout() {
  const { status = 'loading' } = useSession();

  if (status === 'unauthenticated') {
    return <Navigate to='/login' />;
  } else if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className='flex flex-col w-full h-full max-h-full'>
      <main className='flex flex-col w-full flex-1 overflow-y-scroll'>
        <Outlet />
      </main>
    </div>
  );
}
