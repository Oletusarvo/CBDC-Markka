import { HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/auth-layout';
import { Suspense } from 'react';
import { ServiceWorkerLoader } from './components/service-worker-loader';
import { LoadingScreen } from './screen/loading-screen';
import {
  AccountProvider,
  ApiProvider,
  AuthProvider,
  QueryProvider,
} from '@cbdc-markka/utils-react';
import { apiInterface } from './util/api-interface';
import { Toaster } from 'react-hot-toast';
import { WindowResizeManager } from './managers/window-resize-manager';
import { HomeLayout } from './layouts/home-layout';
import { HomeScreen } from './screen/home-screen';
import { LoginScreen } from './screen/login-screen';
import { RegisterScreen } from './screen/register-screen';
import { OverviewBottomNav } from './components/overview-bottom-nav';
import { OverviewScreen } from './screen/overview-screen';
import { SendScreen } from './screen/send-screen';
import { ReceiveScreen } from './screen/receive-screen';
import { LogoutScreen } from './screen/logout-screen';
import { TransactionScreen } from './screen/transaction-screen';

export function App() {
  return (
    <>
      <WindowResizeManager />
      <ApiProvider apiInterface={apiInterface}>
        <QueryProvider>
          <HashRouter>
            <Suspense fallback={<LoadingScreen />}>
              <AuthProvider>
                <Routes>
                  <Route
                    path='/'
                    element={
                      <>
                        <HomeScreen />
                        <Outlet />
                      </>
                    }>
                    <Route
                      path='login'
                      element={<LoginScreen />}
                    />
                    <Route
                      path='register'
                      element={<RegisterScreen />}
                    />
                  </Route>
                  <Route
                    path='/auth'
                    element={
                      <AccountProvider>
                        <Outlet />
                      </AccountProvider>
                    }>
                    <Route
                      path='transaction/:id'
                      element={<TransactionScreen />}
                    />
                    <Route
                      element={
                        <>
                          <div className='flex-1 max-h-full overflow-y-scroll'>
                            <Outlet />
                          </div>

                          <OverviewBottomNav />
                        </>
                      }>
                      <Route
                        path='overview'
                        element={<OverviewScreen />}
                      />
                      <Route
                        path='send'
                        element={<SendScreen />}
                      />
                      <Route
                        path='receive'
                        element={<ReceiveScreen />}
                      />

                      <Route
                        path='logout'
                        element={<LogoutScreen />}
                      />
                    </Route>
                  </Route>
                </Routes>
              </AuthProvider>
            </Suspense>
          </HashRouter>
        </QueryProvider>
        <ServiceWorkerLoader />
      </ApiProvider>
      <Toaster position='bottom-center' />
    </>
  );
}
