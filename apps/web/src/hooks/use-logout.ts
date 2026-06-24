import { useSession } from '@cbdc-markka/utils-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const { signout } = useSession();
  const pending = status === 'loading';

  const handleSignout = async () => {
    setStatus('loading');
    try {
      const res = await signout();
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  useEffect(() => {
    let t = null;
    if (status === 'success') {
      t = setTimeout(() => {
        navigate('/');
      }, 500);
    }
    return () => {
      clearTimeout(t);
    };
  }, [status]);
  return { handleSignout, status, pending };
}
