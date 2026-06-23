import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Form } from '../components/form';
import { EmailInput, PasswordInput } from '../components/input';
import { Button, LoaderButton } from '../components/button';
import { useSubmit } from '../hooks/use-submit';
import { useResetPassword } from '../hooks/use-reset-password';
import { setupContext } from '@cbdc-markka/utils-react';

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { submit, status, loading, token } = useResetPassword();
  const success = status === 'success';
  const step = token ? 1 : 0;
  const onClose = () => {
    step === 0 ? navigate(-1) : navigate('/');
  };

  return (
    <Modal
      title='Vaihda salasanasi'
      onClose={onClose}>
      <Form onSubmit={submit}>
        {step === 0 ? <ResetPasswordStepOne /> : <ResetPasswordStepTwo />}

        <div className='flex gap-2 w-full'>
          <Button
            disabled={loading}
            type='button'
            rounded
            fullWidth
            onClick={onClose}
            variant='outlined'>
            Peruuta
          </Button>
          <LoaderButton
            loading={loading}
            disabled={loading || success}
            type='submit'
            rounded
            fullWidth>
            Lähetä
          </LoaderButton>
        </div>
      </Form>
    </Modal>
  );
}

function ResetPasswordStepOne() {
  return (
    <>
      <EmailInput />
      <span className='text-slate-400 text-sm'>
        Lähetämme sähköpostiisi linkin jonka kautta pääset luomaan uuden salasanan.
      </span>
    </>
  );
}

function ResetPasswordStepTwo() {
  return (
    <>
      <PasswordInput
        placeholder='Anna uusi salasana...'
        fullWidth
      />
      <PasswordInput
        fullWidth
        variant='secondary'
        placeholder='Toista uusi salasana...'
      />
    </>
  );
}
