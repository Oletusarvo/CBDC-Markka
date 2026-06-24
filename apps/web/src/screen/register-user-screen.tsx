import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../components/modal';
import { EmailInput, Input, PasswordInput } from '../components/input';
import { LoaderButton } from '../components/button';
import { ErrorMessage, SuccessMessage } from '../components/helper-message';
import { setupContext } from '@cbdc-markka/utils-react';
import { useRegisterUser } from '../hooks/use-register-user';
import { Form } from '../components/form';

export function RegisterUserScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useRegisterUser();
  return (
    <Modal
      title='Luo Tili'
      onClose={() => navigate('/')}>
      <Form onSubmit={submit}>
        <EmailInput />
        <PasswordInput placeholder='Luo salasana...' />
        <PasswordInput
          variant='secondary'
          placeholder='Toista salasana...'
        />
        <span className='text-slate-400 text-sm'>
          Lähetämme rekisteröitymisen jälkeen sähköpostiisi linkin jonka kautta pääset vahvistamaan
          tilisi.
        </span>
        <LoaderButton
          rounded
          shadow
          disabled={loading || status === 'success'}
          loading={loading}
          fullWidth
          type='submit'>
          Lähetä Vahvistusviesti
        </LoaderButton>
        {status === 'auth:email-taken' ? (
          <ErrorMessage>Sähköpostiosoite on käytössä!</ErrorMessage>
        ) : status === 'auth:unsupported-domain' ? (
          <ErrorMessage>Tuemme ainoastaan gmail-tilejä!</ErrorMessage>
        ) : status === 'success' ? (
          <SuccessMessage>Linkki lähetetty!</SuccessMessage>
        ) : status === 'auth:password-mismatch' ? (
          <ErrorMessage>Salasanat eivät täsmää!</ErrorMessage>
        ) : status !== 'idle' && status !== 'loading' ? (
          <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
        ) : null}
        <Link
          to='/login'
          className='w-full text-center mt-4 link'>
          Onko sinulla jo tili? Klikkaa tähän.
        </Link>
      </Form>
    </Modal>
  );
}
