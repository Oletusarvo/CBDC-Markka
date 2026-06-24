import { Mail } from 'lucide-react';
import { AppScreen } from '../components/app-screen';
import { Button, LoaderButton } from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/use-logout';
import { NoticeScreen } from '../components/notice-screen';

export function PendingUserScreen() {
  const { handleSignout, status, pending } = useLogout();
  return (
    <NoticeScreen
      title='Vahvista sähköpostiosoitteesi'
      bodyText=' Et ole vielä vahvistanut sähköpostiosoitettasi. Ole hyvä ja klikkaa sähköpostiisi
            lähettämäämme vahvistuslinkkiä jotta pääset käyttämään E-Markkaa. Jos et saanut
            viestiämme, ole hyvä ja napauta alla olevaa nappia. Vahvistamattomat tilit poistetaan 24 tunnin kuluttua.'
      footer={
        <div className='flex flex-col gap-4 justify-center w-full'>
          <LoaderButton
            loading={false}
            disabled={pending || status === 'success'}
            type='button'
            rounded
            shadow>
            Lähetä Vahvistuslinkki
          </LoaderButton>
          <LoaderButton
            loading={pending}
            disabled={pending || status === 'success'}
            onClick={handleSignout}
            rounded
            variant='ghost'>
            Kirjaudu Ulos
          </LoaderButton>
        </div>
      }></NoticeScreen>
  );
}
