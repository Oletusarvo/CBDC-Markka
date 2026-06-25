import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { ErrorMessage } from '../components/helper-message';
import { useLogout } from '../hooks/use-logout';
import { useSession } from '@cbdc-markka/utils-react';

export function LogoutScreen() {
  const navigate = useNavigate();
  const { session } = useSession();
  const { handleSignout, status, pending } = useLogout();

  return (
    <Modal
      title='Kirjaudu Ulos'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col gap-2 w-full'>
        <p className='text-slate-500'>Haluatko varmasti kirjautua ulos?</p>
        {status === 'error' ? <ErrorMessage>Uloskirjautuminen epäonnistui!</ErrorMessage> : null}
        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => navigate('/auth/overview')}
            fullWidth
            rounded
            variant='outlined'
            type='button'>
            <ArrowLeft
              color='var(--color-primary)'
              size='1rem'
            />
            Peruuta
          </Button>
          <LoaderButton
            disabled={pending || status === 'success'}
            loading={pending}
            onClick={handleSignout}
            fullWidth
            rounded
            shadow
            variant='contained'
            type='button'>
            <LogOut
              color='white'
              size='1rem'
            />
            Kyllä
          </LoaderButton>
        </div>
      </div>
    </Modal>
  );
}
