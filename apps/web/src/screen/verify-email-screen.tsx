import { useApi } from '@cbdc-markka/utils-react';
import { AppScreen } from '../components/app-screen';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStatus } from '../hooks/use-status';
import { useEffect, useRef } from 'react';
import { NoticeScreen } from '../components/notice-screen';
import { SpinnerTimer } from '../components/spinner';

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
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    let t = null;
    handleVerification().then(() => {
      t = setTimeout(() => {
        navigate('/auth/overview');
      });
    });
    return () => {
      clearTimeout(t);
    };
  }, []);

  return (
    <NoticeScreen
      title='Vahvistetaan sähköpostiosoitetta'
      bodyText='Ole hyvä ja odota kun vahvistamme sähköpostiosoitteesi...'>
      <SpinnerTimer />
    </NoticeScreen>
  );
}
