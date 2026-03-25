import { Navigate, Outlet } from 'react-router-dom';
import { SessionLoadingScreen } from '../screen/session-loading-screen';
import { AccountProvider, useSession } from '@cbdc-markka/utils-react';

export function AuthLayout() {
  const { status } = useSession();
  //const status: any = 'loading';

  if (status === 'unauthenticated') {
    return <Navigate to='/login' />;
  } else if (status === 'loading') {
    return <SessionLoadingScreen />;
  }

  return (
    <AccountProvider>
      <Outlet />
    </AccountProvider>
  );
}
