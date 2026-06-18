import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../components/modal';
import { EmailInput, Input, PasswordInput } from '../components/input';
import { Button, LoaderButton } from '../components/button';

import { ErrorMessage, SuccessMessage } from '../components/helper-message';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useLogin } from '../hooks/use-login';

export function LoginScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useLogin();
  const [searchParams] = useSearchParams();

  return (
    <Modal
      title='Kirjaudu Sisään'
      onClose={() => navigate('/')}>
      <form
        className='flex flex-col gap-2 w-full'
        onSubmit={submit}>
        <EmailInput />
        <PasswordInput placeholder='Anna salasanasi...' />

        <div className='flex gap-2 w-full'>
          <Button
            rounded
            fullWidth
            variant='outlined'
            type='button'
            onClick={() => navigate('/')}>
            <ArrowLeft
              color='var(--color-primary)'
              size='1rem'
            />
            Peruuta
          </Button>
          <LoaderButton
            disabled={loading || status === 'success'}
            loading={loading}
            type='submit'
            fullWidth
            rounded
            shadow>
            <LogIn
              color='white'
              size='1rem'
            />
            Kirjaudu
          </LoaderButton>
        </div>
        {status.includes('auth:') ? (
          <ErrorMessage>Virheelliset tunnistautumistiedot!</ErrorMessage>
        ) : status === 'error' ? (
          <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
        ) : status === 'success' ? (
          <SuccessMessage>Sisäänkirjautuminen onnistui!</SuccessMessage>
        ) : null}
        <Link
          to='/register'
          className='w-full text-center mt-4'>
          Eikö sinulla ole tiliä? Luo se tästä.
        </Link>
      </form>
    </Modal>
  );
}
