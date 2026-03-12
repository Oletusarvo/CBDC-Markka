import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { useQuery } from '@tanstack/react-query';
import { useAnimatedNumber } from '../hooks/use-animated-number';
import { Spinner } from '../components/spinner';

import { LoadingScreen } from '../screen/loading-screen';

import { useSession } from '@cbdc-markka/utils-react';
import { apiInterface } from '../util/api-interface';
import { LogIn, User, UserPlus } from 'lucide-react';
import { CurrencySymbol } from '../components/currency';

export function MainLayout() {
  const { status } = useSession();
  const navigate = useNavigate();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className='flex flex-col flex-1 antialiased'>
      <section className='w-full px-4 py-32 flex items-center relative flex-1'>
        <div
          className='absolute top-0 left-0 w-full h-full opacity-15 -z-10'
          id='index-image'
        />
        <div className='flex flex-col items-center w-full'>
          <h1 className='text-2xl font-semibold text-primary'>CBDC Markka</h1>
          <p className='text-center text-sm'>Suomen markan inspiroima digitaaliraha.</p>
          <div className='flex w-full gap-2 mt-8 xs:flex-col sm:flex-row'>
            {status === 'unauthenticated' ? (
              <>
                <Button
                  color='primary-pretty'
                  onClick={() => navigate('/register')}
                  fullWidth
                  type='button'
                  rounded
                  shadow>
                  <UserPlus
                    color='white'
                    size='1rem'
                  />
                  Luo Tili
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  fullWidth
                  type='button'
                  variant='outlined'
                  rounded>
                  <LogIn
                    color='var(--color-primary)'
                    size='1rem'
                  />
                  Kirjaudu Sisään
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth/overview')}
                color='primary-pretty'
                fullWidth
                type='button'
                variant='contained'
                rounded
                shadow>
                <User
                  color='white'
                  size='1rem'
                />{' '}
                Näytä Tilisi
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className='w-full py-16 bg-gray-900 text-white px-4'>
        <h2 className='font-semibold text-xl mb-4'>Mikä on CBDC-Markka?</h2>
        <p className='text-gray-200'>
          <strong>Digitaalinen markka.</strong> Yksinkertainen tapa lähettää ja vastaanottaa rahaa
          verkossa. Valuuttamme perustuu Suomen markkaan, tuttuun ja selkeään rahayksikköön.
          Maksaminen on nopeaa: skannaa QR-koodi, syötä summa ja vahvista maksu. Kaikki maksut
          näkyvät selkeästä tapahtumahistoriasta.
          <br />
          <br /> Järjestelmä on <strong>keskitetty</strong>, jotta maksut pysyvät nopeina ja
          yksinkertaisina käyttää. Digitaalisia markkoja tulee olemaan kierrossa{' '}
          <strong>enintään 100 miljoonaa</strong>, eikä määrää kasvateta tämän rajan yli.
          Tarvittaessa valuutan tarkkuutta voidaan sen sijaan kasvattaa – valuutta alkaa{' '}
          <strong>kahden desimaalin tarkkuudella</strong>, jota voidaan lisätä tarpeen mukaan.
          Jokainen uusi tili avataan 20 markan aloitussaldolla, kunnes 100 miljoonan raja on
          saavutettu.
          <br />
          <br />
          Monet nykyiset valuutat perustuvat jatkuvaan rahan luomiseen, mikä voi heikentää niiden
          arvoa ajan myötä. Tämän valuutan perusajatus on päinvastainen: rajallinen määrä rahaa voi
          auttaa{' '}
          <strong>säilyttämään ostovoiman – ja pitkällä aikavälillä jopa vahvistamaan sitä.</strong>
          <br />
          <br />
          Projekti on kokeilu, joka tuo markan digitaaliseen aikaan ja tutkii, millainen voisi olla
          yksinkertainen suomalainen digitaalinen valuutta.
        </p>
      </section>

      <footer className='flex w-full py-16 px-4 bg-primary text-white'>
        <CirculationDisplay />
      </footer>

      <Outlet />
    </div>
  );
}

function CirculationDisplay() {
  const { data, isPending } = useQuery({
    queryKey: ['circulation'],
    queryFn: async () => {
      const res = await fetch(apiInterface.withApi('currencies/circulation'), {
        method: 'GET',
      });
      return res.status === 200 ? await res.json() : null;
    },
    refetchInterval: 30000,
  });

  const currentCirculation = useAnimatedNumber(!isPending ? data.circulation / 100 : 0);

  return (
    <div className='flex flex-col w-full items-center mb-4'>
      <span className='text-sm'>Kierrossa</span>
      <div className='font-mono text-lg flex items-center'>
        <CurrencySymbol size='var(--text-lg)' />
        {isPending ? (
          <Spinner />
        ) : (
          Number(currentCirculation).toLocaleString('fi', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )}
      </div>
    </div>
  );
}
