import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SessionLoadingScreen } from '../screen/session-loading-screen';
import { AccountProvider, useSession } from '@cbdc-markka/utils-react';

const loginRedirectExemptions = ['/auth/logout'];
export function AuthLayout() {
  const { status, session } = useSession();
  const location = useLocation();
  //const status: any = 'loading';

  if (status === 'unauthenticated' && !loginRedirectExemptions.includes(location.pathname)) {
    const url = `/login?callback_url=${location.pathname}`;
    return <Navigate to={url} />;
  } else if (status === 'loading') {
    return <SessionLoadingScreen />;
  } else if (session?.user.status === 'pending') {
    return <Navigate to='/pending-user' />;
  }

  return (
    <AccountProvider>
      <Outlet />
    </AccountProvider>
  );
}
