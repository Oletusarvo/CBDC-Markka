import { useNavigate } from "react-router-dom";
import { Modal } from "../components/modal";
import { Form } from "../components/form";
import { EmailInput, PasswordInput } from "../components/input";
import { Button, LoaderButton } from "../components/button";
import { useSubmit } from "../hooks/use-submit";
import { useResetPassword } from "../hooks/use-reset-password";
import { setupContext } from "@cbdc-markka/utils-react";
import { ErrorMessage, SuccessMessage } from "../components/helper-message";
import { NativeBannerAd } from "../components/ad";

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useResetPassword();
  const success = status === "success";
  const onClose = () => {
    navigate("/");
  };

  return (
    <Modal title='Change Password' onClose={onClose}>
      <Form onSubmit={submit}>
        <PasswordInput placeholder='Type your new password...' fullWidth />
        <PasswordInput fullWidth variant='secondary' placeholder='Repeat your new password...' />

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
        {status !== "success" && status !== "loading" && status !== "idle" ? (
          <ErrorMessage>Something went wrong!</ErrorMessage>
        ) : status === "success" ? (
          <SuccessMessage>Password changed successfully!</SuccessMessage>
        ) : null}
      </Form>
      <NativeBannerAd />
    </Modal>
  );
}

function ResetPasswordStepTwo() {
  return (
    <>
      <PasswordInput placeholder='Anna uusi salasana...' fullWidth />
      <PasswordInput fullWidth variant='secondary' placeholder='Toista uusi salasana...' />
    </>
  );
}
