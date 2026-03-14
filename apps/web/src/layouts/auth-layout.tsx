import { Navigate, Outlet, Route } from 'react-router-dom';
import { LoadingScreen } from '../screen/loading-screen';
import { useSession } from '@cbdc-markka/utils-react';
import { WalletLayout } from './wallet-layout';
import { TransactionScreen } from '../screen/transaction-screen';
import { LogoutScreen } from '../screen/logout-screen';

export function AuthLayout() {
  const { status = 'loading' } = useSession();

  if (status === 'unauthenticated') {
    return <Navigate to='/login' />;
  } else if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Route
      path='/auth'
      element={<Outlet />}>
      <WalletLayout />

      <Route
        path='transaction/:id'
        element={<TransactionScreen />}
      />

      <Route
        path='logout'
        element={<LogoutScreen />}
      />
    </Route>
  );
}
