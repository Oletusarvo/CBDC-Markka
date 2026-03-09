import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Input } from '../components/input';
import { Button, LoaderButton } from '../components/button';

import { useState } from 'react';
import { ErrorMessage } from '../components/helper-message';
import { useSession } from '@cbdc-markka/utils-react';
import { ArrowLeft, LogIn } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();
  const { signin } = useSession();
  const [status, setStatus] = useState('idle');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const credentials = Object.fromEntries(new FormData(e.currentTarget)) as any;

      const res = await signin(credentials);

      if (res.status === 200) {
        setStatus('success');
        setTimeout(() => {
          navigate('/auth/overview');
        }, 700);
      } else if (res.status !== 503) {
        const err = await res.json();
        setStatus(err.error);
      } else {
        throw new Error('Received response 503');
      }
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <Modal
      title='Kirjaudu Sisään'
      onClose={() => navigate('/')}>
      <form
        className='flex flex-col gap-2 w-full'
        onSubmit={handleLogin}>
        <Input
          name='email'
          type='email'
          required
          placeholder='Sähköpostiosoitteesi...'
        />
        <div className='flex flex-col w-full'>
          <Input
            name='password'
            type='password'
            required
            placeholder='Salasanasi...'
          />
          {status.includes('auth:') ? (
            <ErrorMessage>Virheelliset tunnistautumistiedot!</ErrorMessage>
          ) : null}
        </div>

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
            disabled={status === 'loading' || status === 'success'}
            loading={status === 'loading'}
            type='submit'
            fullWidth
            rounded
            shadow>
            <LogIn
              color='white'
              size='1rem'
            />
            Kirjaudu Sisään
          </LoaderButton>
        </div>

        <Link
          to='/register'
          className='w-full text-center mt-4'>
          Eikö sinulla ole tiliä? Luo se tästä.
        </Link>
      </form>
    </Modal>
  );
}
