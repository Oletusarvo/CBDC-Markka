import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/auth-layout';
import { Suspense } from 'react';
import { ServiceWorkerLoader } from './components/service-worker-loader';
import { SessionLoadingScreen } from './screen/session-loading-screen';
import { ApiProvider, AuthProvider, QueryProvider } from '@cbdc-markka/utils-react';
import { apiInterface } from './util/api-interface';
import { Toaster } from 'react-hot-toast';
import { WindowResizeManager } from './managers/window-resize-manager';
import { HomeScreen } from './screen/home-screen';
import { LoginScreen } from './screen/login-screen';
import { RegisterUserScreen } from './screen/register-user-screen';
import { OverviewBottomNav } from './components/overview-bottom-nav';
import { OverviewScreen } from './screen/overview-screen';
import { SendScreen } from './screen/send-screen';
import { ReceiveScreen } from './screen/receive-screen';
import { LogoutScreen } from './screen/logout-screen';
import { TransactionScreen } from './screen/transaction-screen';
import { PaymentSessionScreen } from './screen/payment-session-screen';
import { ResetPasswordScreen } from './screen/reset-password-screen';
import { PendingUserScreen } from './screen/pending-user-screen';
import { VerifyEmailScreen } from './screen/verify-email-screen';
import { ForgotPasswordScreen } from './screen/forgot-password-screen';

const RouterComponent = BrowserRouter;

export function App() {
  return (
    <>
      <WindowResizeManager />
      <ApiProvider apiInterface={apiInterface}>
        <QueryProvider>
          <RouterComponent>
            <Suspense fallback={<SessionLoadingScreen />}>
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
                      element={<RegisterUserScreen />}
                    />
                    <Route
                      path='reset-password'
                      element={<ResetPasswordScreen />}
                    />
                    <Route
                      path='forgot-password'
                      element={<ForgotPasswordScreen />}
                    />
                  </Route>
                  <Route
                    path='/auth'
                    element={<AuthLayout />}>
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
                    </Route>
                    <Route
                      path='logout'
                      element={<LogoutScreen />}
                    />

                    <Route
                      path='payment-session/:id'
                      element={<PaymentSessionScreen />}
                    />
                  </Route>
                  <Route
                    path='/pending-user'
                    element={<PendingUserScreen />}
                  />
                  <Route
                    path='/verify-email'
                    element={<VerifyEmailScreen />}
                  />
                </Routes>
              </AuthProvider>
            </Suspense>
          </RouterComponent>
        </QueryProvider>
        <ServiceWorkerLoader />
      </ApiProvider>
      <Toaster position='bottom-center' />
    </>
  );
}
