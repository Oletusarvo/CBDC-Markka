import { Outlet, Route } from 'react-router-dom';
import { LoginScreen } from '../screen/login-screen';
import { RegisterScreen } from '../screen/register-screen';
import { HomeScreen } from '../screen/home-screen';

export function HomeLayout() {
  return (
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
  );
}
