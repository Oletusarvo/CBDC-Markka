import { useNavigate } from 'react-router-dom';
import { Form } from '../components/form';
import { EmailInput } from '../components/input';
import { Modal } from '../components/modal';
import { useSendPasswordResetEmail } from '../hooks/use-send-password-reset-email';
import { Button, LoaderButton } from '../components/button';
import { ErrorMessage, SuccessMessage } from '../components/helper-message';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useSendPasswordResetEmail();
  const onClose = () => navigate(-1);
  const success = status === 'success';
  return (
    <Modal
      title='Unohtunut salasana'
      onClose={onClose}>
      <Form onSubmit={submit}>
        <EmailInput />
        <span className='text-slate-400 text-sm'>
          Lähetämme sähköpostiisi linkin jonka kautta pääset luomaan uuden salasanan.
        </span>

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
        {status !== 'loading' && status !== 'success' && status !== 'idle' ? (
          <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
        ) : status === 'success' ? (
          <SuccessMessage>Sähköposti lähetetty!</SuccessMessage>
        ) : null}
      </Form>
    </Modal>
  );
}
