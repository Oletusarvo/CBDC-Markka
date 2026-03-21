import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../components/modal';
import { EmailInput, Input, PasswordInput } from '../components/input';
import { LoaderButton } from '../components/button';
import { ErrorMessage, SuccessMessage } from '../components/helper-message';
import { setupContext } from '@cbdc-markka/utils-react';
import { useRegisterStepOne, useRegisterStepTwo } from '../hooks/use-register';

const [RegisterContext, useRegisterContext] = setupContext<{}>('RegisterContext');
export function RegisterScreen() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <Modal
      title='Luo Tili'
      onClose={() => navigate('/')}>
      {token ? <StepTwo /> : <StepOne />}
    </Modal>
  );
}

function Form({ children, ...props }: React.ComponentProps<'form'>) {
  return (
    <form
      {...props}
      className='flex gap-2 flex-col w-full'>
      {children}
    </form>
  );
}

function StepOne() {
  const { submit, status, loading } = useRegisterStepOne();
  return (
    <Form onSubmit={submit}>
      <EmailInput />
      <span className='text-slate-400 text-sm'>
        Lähetämme sähköpostiisi linkin jonka kautta pääset luomaan salasanan.
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
        <ErrorMessage>Annettu sähköpostiosoite on käytössä!</ErrorMessage>
      ) : status === 'auth:unsupported-domain' ? (
        <ErrorMessage>Tuemme ainoastaan gmail-tilejä!</ErrorMessage>
      ) : status === 'success' ? (
        <SuccessMessage>Linkki lähetetty!</SuccessMessage>
      ) : status === 'error' ? (
        <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
      ) : null}
      <Link
        to='/login'
        className='w-full text-center mt-4'>
        Onko sinulla jo tili? Klikkaa tähän.
      </Link>
    </Form>
  );
}

/**Rendered when the pathname has a token-query param. */
function StepTwo() {
  const { submit, status, loading } = useRegisterStepTwo();

  return (
    <Form
      className='w-full flex gap-2 flex-col'
      onSubmit={submit}>
      <PasswordInput
        variant='primary'
        placeholder='Luo salasana...'
      />
      <PasswordInput
        variant='secondary'
        placeholder='Toista salasana...'
      />
      <LoaderButton
        rounded
        loading={loading}
        type='submit'
        variant='contained'
        fullWidth>
        Lähetä
      </LoaderButton>
      {status === 'auth:password-mismatch' ? (
        <ErrorMessage>Salasanat eivät täsmää!</ErrorMessage>
      ) : status === 'error' ? (
        <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
      ) : null}
    </Form>
  );
}
