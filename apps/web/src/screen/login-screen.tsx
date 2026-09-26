import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "../components/modal";
import { EmailInput, Input, PasswordInput } from "../components/input";
import { Button, LoaderButton } from "../components/button";

import { ErrorMessage, SuccessMessage } from "../components/helper-message";
import { ArrowLeft, LogIn } from "lucide-react";
import { useLogin } from "../hooks/use-login";
import { Form } from "../components/form";
import { NativeBannerAd } from "../components/ad";

export function LoginScreen() {
  const navigate = useNavigate();
  const { submit, status, loading, returnTo } = useLogin();

  const onClose = () => {
    const url = new URL(returnTo, window.location.origin);
    if (url.origin === window.location.origin) {
      navigate("/");
    } else {
      window.location.href = returnTo;
    }
  };
  return (
    <Modal title='Login' onClose={onClose}>
      <Form onSubmit={submit}>
        <EmailInput />
        <PasswordInput placeholder='Enter your password...' />

        <div className='flex gap-2 w-full'>
          <Button rounded fullWidth variant='outlined' type='button' onClick={() => navigate("/")}>
            <ArrowLeft color='var(--color-primary)' size='1rem' />
            Cancel
          </Button>
          <LoaderButton
            disabled={loading || status === "success"}
            loading={loading}
            type='submit'
            fullWidth
            rounded
            shadow
          >
            <LogIn color='white' size='1rem' />
            Login
          </LoaderButton>
        </div>
        {status.includes("auth:") ? (
          <ErrorMessage>Invalid credentials!</ErrorMessage>
        ) : status === "error" ? (
          <ErrorMessage>Something went wrong!</ErrorMessage>
        ) : status === "success" ? (
          <SuccessMessage>Login succeeded!</SuccessMessage>
        ) : null}
        <div className='flex flex-col gap-2 mt-4'>
          <Link to='/register' className='w-full text-center link'>
            Don't have an account? Create one here.
          </Link>
          <Link to='/forgot-password' className='w-full text-center link'>
            Forgot your password?
          </Link>
        </div>
      </Form>
      <NativeBannerAd />
    </Modal>
  );
}
