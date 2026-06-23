import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SessionLoadingScreen } from '../screen/session-loading-screen';
import { AccountProvider, useSession } from '@cbdc-markka/utils-react';

export function AuthLayout() {
  const { status } = useSession();
  const location = useLocation();
  //const status: any = 'loading';

  if (status === 'unauthenticated') {
    const url = `/login?callback_url=${location.pathname}`;
    return <Navigate to={url} />;
  } else if (status === 'loading') {
    return <SessionLoadingScreen />;
  }

  return (
    <AccountProvider>
      <Outlet />
    </AccountProvider>
  );
}
