import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-2 items-center justify-center h-full px-4'>
      <div
        className='absolute top-0 left-0 w-full h-full opacity-15 -z-10'
        id='index-image'
      />
      <h1 className='text-2xl font-semibold text-primary mb-4'>CBDC Markka</h1>
      <Button
        color='primary-pretty'
        onClick={() => navigate('/register')}
        fullWidth
        type='button'
        rounded
        shadow>
        Luo Tili
      </Button>
      <Button
        onClick={() => navigate('/login')}
        fullWidth
        type='button'
        variant='outlined'
        rounded>
        Kirjaudu Sisään
      </Button>
      <Outlet />
    </div>
  );
}
