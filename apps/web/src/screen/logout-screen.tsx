import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { useState } from 'react';
import { useSession } from '@cbdc-markka/utils-react';
import { ArrowLeft, Check, LogOut } from 'lucide-react';
import { ErrorMessage } from '../components/helper-message';

export function LogoutScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const { signout } = useSession();
  const pending = status === 'loading';

  const handleSignout = async () => {
    setStatus('loading');
    try {
      const res = await signout();
      setTimeout(() => {
        if (res.status === 200) {
          navigate('/');
        }
        setStatus('success');
      }, 500);
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

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
