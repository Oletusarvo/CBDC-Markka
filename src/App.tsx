import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/auth-layout';
import { OverviewLayout } from './layouts/overview-layout';
import { SendScreen } from './screen/send-screen';
import { ReceiveScreen } from './screen/receive-screen';
import { LoginScreen } from './screen/login-screen';
import { MainLayout } from './layouts/main-layout';
import { RegisterScreen } from './screen/register-screen';
import { AuthProvider } from './providers/auth-provider';
import { Suspense } from 'react';
import { QueryProvider } from './providers/query-provider';
import { Spinner } from './components/spinner';
import { LogoutScreen } from './screen/logout-screen';

export function App() {
  return (
    <QueryProvider>
      <HashRouter>
        <Suspense fallback={<Spinner />}>
          <AuthProvider>
            <Routes>
              <Route
                path='/'
                element={<MainLayout />}>
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
                element={<AuthLayout />}>
                <Route
                  path='overview'
                  element={<OverviewLayout />}>
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
                  path='transactions'
                  element={null}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </Suspense>
      </HashRouter>
    </QueryProvider>
  );
}
