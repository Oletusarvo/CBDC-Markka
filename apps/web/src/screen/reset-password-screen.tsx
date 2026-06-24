import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Form } from '../components/form';
import { EmailInput, PasswordInput } from '../components/input';
import { Button, LoaderButton } from '../components/button';
import { useSubmit } from '../hooks/use-submit';
import { useResetPassword } from '../hooks/use-reset-password';
import { setupContext } from '@cbdc-markka/utils-react';
import { ErrorMessage, SuccessMessage } from '../components/helper-message';

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useResetPassword();
  const success = status === 'success';
  const onClose = () => {
    navigate('/');
  };

  return (
    <Modal
      title='Vaihda salasanasi'
      onClose={onClose}>
      <Form onSubmit={submit}>
        <PasswordInput
          placeholder='Anna uusi salasana...'
          fullWidth
        />
        <PasswordInput
          fullWidth
          variant='secondary'
          placeholder='Toista uusi salasana...'
        />

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
        {status !== 'success' && status !== 'loading' && status !== 'idle' ? (
          <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
        ) : status === 'success' ? (
          <SuccessMessage>Salasanan vaihto onnistui!</SuccessMessage>
        ) : null}
      </Form>
    </Modal>
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
