import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { useQuery } from '@tanstack/react-query';
import { withApi } from '../util/server-config';
import { useAnimatedNumber } from '../hooks/use-animated-number';
import { Spinner } from '../components/spinner';

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-2 items-center justify-center h-full px-4'>
      <div
        className='absolute top-0 left-0 w-full h-full opacity-15 -z-10'
        id='index-image'
      />
      <h1 className='text-2xl font-semibold text-primary mb-4'>CBDC Markka</h1>

      <CirculationDisplay />
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

function CirculationDisplay() {
  const { data, isPending } = useQuery({
    queryKey: ['circulation'],
    queryFn: async () => {
      const res = await fetch(withApi('currencies/circulation'), {
        method: 'GET',
      });
      return res.status === 200 ? await res.json() : null;
    },
    refetchInterval: 30000,
  });

  const currentCirculation = useAnimatedNumber(!isPending ? data.circulation / 100 : 0);

  return (
    <div className='flex flex-col w-full items-center mb-4'>
      <span>Kierrossa</span>
      <span className='font-mono'>
        {isPending ? <Spinner /> : currentCirculation.toFixed(2)} mk
      </span>
    </div>
  );
}
