import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../components/modal";
import { EmailInput, Input, PasswordInput } from "../components/input";
import { LoaderButton } from "../components/button";
import { ErrorMessage, SuccessMessage } from "../components/helper-message";
import { setupContext } from "@cbdc-markka/utils-react";
import { useRegisterUser } from "../hooks/use-register-user";
import { Form } from "../components/form";
import { NativeBannerAd } from "../components/ad";

export function RegisterUserScreen() {
  const navigate = useNavigate();
  const { submit, status, loading } = useRegisterUser();
  return (
    <Modal title='Create Account' onClose={() => navigate("/")}>
      <Form onSubmit={submit}>
        <EmailInput />
        <PasswordInput placeholder='Create password...' />
        <PasswordInput variant='secondary' placeholder='Repeat password...' />
        <span className='text-slate-400 text-sm'>
          We will send a link to your inbox through which to verify your account.
        </span>
        <LoaderButton
          rounded
          shadow
          disabled={loading || status === "success"}
          loading={loading}
          fullWidth
          type='submit'
        >
          Send Verification Link
        </LoaderButton>
        {status === "auth:email-taken" ? (
          <ErrorMessage>That email is already in use!</ErrorMessage>
        ) : status === "auth:unsupported-domain" ? (
          <ErrorMessage>We only support gmail accounts!</ErrorMessage>
        ) : status === "success" ? (
          <SuccessMessage>Link sent!</SuccessMessage>
        ) : status === "auth:password-mismatch" ? (
          <ErrorMessage>The passwords do not match!</ErrorMessage>
        ) : status !== "idle" && status !== "loading" ? (
          <ErrorMessage>Something went wrong!</ErrorMessage>
        ) : null}
        <Link to='/login' className='w-full text-center mt-4 link'>
          Already have an account? Click here.
        </Link>
      </Form>
      <NativeBannerAd />
    </Modal>
  );
}
