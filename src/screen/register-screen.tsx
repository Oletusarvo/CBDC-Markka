import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Input } from '../components/input';
import { Button, LoaderButton } from '../components/button';
import { withApi } from '../util/server-config';
import { useState } from 'react';

export function RegisterScreen() {
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    const credentials = Object.fromEntries(new FormData(e.currentTarget)) as any;

    const res = await fetch(withApi('auth/register'), {
      method: 'POST',
      body: JSON.stringify(credentials),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      setStatus('success');
      navigate('/login');
    } else {
      const error = await res.json();
      setStatus(error.error);
    }
  };

  return (
    <Modal
      title='Luo Tili'
      onClose={() => navigate('/')}>
      <form
        className='flex flex-col gap-2 w-full'
        onSubmit={handleRegister}>
        <div className='flex flex-col w-full'>
          <Input
            type='email'
            name='email'
            required
            placeholder='Kirjoita sähköpostiosoitteesi...'
          />
          {status === 'auth:email-taken' ? (
            <span className='text-sm text-red-600'>Antamasi sähköpostiosoite on jo käytössä!</span>
          ) : null}
        </div>

        <Input
          type='password'
          name='password1'
          required
          placeholder='Luo salasana...'
          autoComplete='new-password webauthn'
        />
        <Input
          type='password'
          name='password2'
          required
          placeholder='Kirjoita salasana uudelleen...'
          autoComplete='new-password webauthn'
        />
        <div className='flex gap-2 w-full'>
          <Button
            rounded
            fullWidth
            variant='outlined'
            type='button'
            onClick={() => navigate('/')}>
            Peruuta
          </Button>
          <LoaderButton
            loading={status === 'loading'}
            disabled={status === 'loading' || status === 'success'}
            type='submit'
            fullWidth
            rounded
            shadow>
            Luo Tili
          </LoaderButton>
        </div>
        <Link
          to='/login'
          className='w-full text-center mt-4'>
          Onko sinulla jo tili? Kirjaudu sisään tästä.
        </Link>
      </form>
    </Modal>
  );
}
