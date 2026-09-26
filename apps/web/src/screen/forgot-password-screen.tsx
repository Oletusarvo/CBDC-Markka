import { useNavigate } from "react-router-dom";
import { Form } from "../components/form";
import { EmailInput } from "../components/input";
import { Modal } from "../components/modal";
import { useSendPasswordResetEmail } from "../hooks/use-send-password-reset-email";
import { Button, LoaderButton } from "../components/button";
import { ErrorMessage, SuccessMessage } from "../components/helper-message";
import { NativeBannerAd } from "../components/ad";

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useSendPasswordResetEmail();
  const onClose = () => navigate(-1);
  const success = status === "success";
  return (
    <Modal title='Forgot Password' onClose={onClose}>
      <Form onSubmit={submit}>
        <EmailInput />
        <span className='text-slate-400 text-sm'>
          We will send you a link through which to update your password.
        </span>

        <div className='flex gap-2 w-full'>
          <Button
            disabled={loading}
            type='button'
            rounded
            fullWidth
            onClick={onClose}
            variant='outlined'
          >
            Cancel
          </Button>
          <LoaderButton
            loading={loading}
            disabled={loading || success}
            type='submit'
            rounded
            fullWidth
          >
            Submit
          </LoaderButton>
        </div>
        {status !== "loading" && status !== "success" && status !== "idle" ? (
          <ErrorMessage>Something went wrong!</ErrorMessage>
        ) : status === "success" ? (
          <SuccessMessage>Email sent!</SuccessMessage>
        ) : null}
      </Form>
      <NativeBannerAd />
    </Modal>
  );
}
