import { useApi } from '@cbdc-markka/utils-react';
import { AppScreen } from '../components/app-screen';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStatus } from '../hooks/use-status';
import { useEffect, useRef } from 'react';
import { NoticeScreen } from '../components/notice-screen';
import { Spinner, SpinnerTimer } from '../components/spinner';
import { Button } from '../components/button';

export function VerifyEmailScreen() {
  const navigate = useNavigate();
  const { apiInterface } = useApi();
  const [searchParams] = useSearchParams();
  const { status, setStatus, loading } = useStatus();
  const token = searchParams.get('token');

  const handleVerification = async () => {
    try {
      setStatus('loading');

      const res = await apiInterface.verifyUserById({ token });
      if (!res.ok) {
        if (res.status === 409) {
          navigate('/');
        }
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
      bodyText='Ole hyvä ja odota kun vahvistamme sähköpostiosoitteesi...'>
      {status === 'loading' ? (
        <Spinner />
      ) : status !== 'idle' && status !== 'loading' && status !== 'success' ? (
        <Button
          onClick={handleVerification}
          type='button'
          rounded>
          Yritä uudelleen
        </Button>
      ) : null}
    </NoticeScreen>
  );
}
