import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-2 items-center justify-center h-full px-4'>
      <h1 className='text-lg font-semibold text-slate-500 mb-4'>Korruptiomummon Markka</h1>
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
