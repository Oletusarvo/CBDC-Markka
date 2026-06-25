import { Mail } from 'lucide-react';
import { AppScreen } from '../components/app-screen';
import { Button, LoaderButton } from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/use-logout';
import { NoticeScreen } from '../components/notice-screen';
import { useSession } from '@cbdc-markka/utils-react';

export function PendingUserScreen() {
  const { handleSignout, status, pending } = useLogout();
  const { session } = useSession();
  const navigate = useNavigate();

  const abortButton = (
    <LoaderButton
      loading={pending}
      disabled={pending || status === 'success'}
      onClick={session ? handleSignout : () => navigate(-1)}
      rounded
      variant='ghost'>
      {session ? 'Kirjaudu Ulos' : 'Peruuta'}
    </LoaderButton>
  );

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
          {abortButton}
        </div>
      }></NoticeScreen>
  );
}
