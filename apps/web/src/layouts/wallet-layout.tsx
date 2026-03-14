import { Outlet, Route } from 'react-router-dom';
import { OverviewBottomNav } from '../components/overview-bottom-nav';
import { OverviewScreen } from '../screen/overview-screen';
import { SendScreen } from '../screen/send-screen';
import { ReceiveScreen } from '../screen/receive-screen';
import { AccountProvider } from '@cbdc-markka/utils-react';

export function WalletLayout() {
  return (
    <Route
      element={
        <AccountProvider>
          <Outlet />

          <OverviewBottomNav />
        </AccountProvider>
      }>
      <Route
        path='overview'
        element={<OverviewScreen />}>
        <Route
          path='send'
          element={<SendScreen />}
        />
        <Route
          path='receive'
          element={<ReceiveScreen />}
        />
      </Route>
    </Route>
  );
}
