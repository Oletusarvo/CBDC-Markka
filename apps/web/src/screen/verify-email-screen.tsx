import { useApi } from '@cbdc-markka/utils-react';
import { AppScreen } from '../components/app-screen';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStatus } from '../hooks/use-status';
import { useEffect, useRef } from 'react';
import { NoticeScreen } from '../components/notice-screen';
import { Spinner, SpinnerTimer } from '../components/spinner';
import { Button, LoaderButton } from '../components/button';
import { ErrorMessage, SuccessMessage } from '../components/helper-message';

/**Verifies a users email in the background and redirects to the login page if it succeeds. */
export function VerifyEmailScreen() {
  const navigate = useNavigate();
  const { apiInterface } = useApi();
  const [searchParams] = useSearchParams();
  const { status, setStatus, loading } = useStatus();
  const success = status === 'success';
  const token = searchParams.get('token');

  const handleVerification = async () => {
    try {
      setStatus('loading');
      const res = await apiInterface.verifyUserById({ token });
      if (!res.ok) {
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleVerification();
  }, []);

  useEffect(() => {
    let t = null;
    if (status === 'success') {
      t = setTimeout(() => {
        navigate('/auth/overview');
      });
    }
    return () => {
      clearTimeout(t);
    };
  }, [status]);

  return (
    <NoticeScreen
      title='Vahvistetaan sähköpostiosoitetta'
      bodyText='Ole hyvä ja odota kun vahvistamme sähköpostiosoitteesi...'
      footer={
        <div className='flex flex-col gap-4 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <LoaderButton
              loading={loading}
              disabled={loading || success}
              onClick={handleVerification}
              type='button'
              rounded>
              Yritä uudelleen
            </LoaderButton>
            <Button
              onClick={() => navigate('/')}
              disabled={loading || success}
              variant='outlined'
              rounded>
              Peruuta
            </Button>
          </div>
          {status !== 'loading' && status !== 'idle' && status !== 'success' ? (
            <ErrorMessage>Jotain meni pieleen!</ErrorMessage>
          ) : status === 'success' ? (
            <SuccessMessage>Sähköpostin vahvistus onnistui!</SuccessMessage>
          ) : null}
        </div>
      }></NoticeScreen>
  );
}
