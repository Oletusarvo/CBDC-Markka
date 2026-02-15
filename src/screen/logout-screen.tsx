import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { withApi } from '../util/server-config';
import { useState } from 'react';
import { useSession } from '../providers/auth-provider';

export function LogoutScreen() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const { signout } = useSession();
  const handleSignout = async () => {
    setPending(true);
    await signout();
    setPending(false);
    navigate('/');
  };
  return (
    <Modal
      title='Kirjaudu Ulos'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col gap-2 w-full'>
        <p>Haluatko varmasti kirjautua ulos?</p>
        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => navigate('/auth/overview')}
            fullWidth
            rounded
            variant='outlined'
            type='button'>
            Peruuta
          </Button>
          <LoaderButton
            loading={pending}
            onClick={handleSignout}
            fullWidth
            rounded
            shadow
            variant='contained'
            type='button'>
            Kyllä
          </LoaderButton>
        </div>
      </div>
    </Modal>
  );
}
