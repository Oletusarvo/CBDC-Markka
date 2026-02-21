import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { useQuery } from '@tanstack/react-query';
import { withApi } from '../util/server-config';
import { useAnimatedNumber } from '../hooks/use-animated-number';
import { Spinner } from '../components/spinner';

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-full'>
      <section className='w-full px-4 py-32 flex items-center'>
        <div
          className='absolute top-0 left-0 w-full h-full opacity-15 -z-10'
          id='index-image'
        />
        <div className='flex flex-col items-center w-full'>
          <h1 className='text-2xl font-semibold text-primary'>CBDC Markka</h1>
          <p>Fyysesti mallinnettu digitaaliraha</p>
          <div className='flex w-full gap-2 mt-4'>
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
          </div>
        </div>
      </section>

      <section className='w-full py-16 bg-gray-900 text-white px-4'>
        <h2 className='font-semibold text-xl mb-4'>Mikä on CBDC-Markka?</h2>
        <p className='text-gray-200'>
          Tämä on digitaalinen valuutta, jossa raha ei ole pelkkä numero tietokannassa.
          Perinteisessä tilimallissa saldo on vain arvo, esim: 1000. Järjestelmä päivittää numeroa
          ylös ja alas, mutta itse rahalla ei ole yksilöllistä olemassaoloa. Tässä järjestelmässä
          raha mallinnetaan yksittäisinä digitaalisina seteleinä — olioina, joilla on oma
          identiteetti ja omistaja.
        </p>
      </section>

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
