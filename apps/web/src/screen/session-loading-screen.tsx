import { useEffect, useState } from 'react';
import { Spinner, SpinnerTimer } from '../components/spinner';
import { AppIcon } from '../components/app-icon';
import { Button } from '../components/button';
import { useNavigate } from 'react-router-dom';
import { NoticeScreen } from '../components/notice-screen';

export function SessionLoadingScreen() {
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  useEffect(() => {
    const i = setInterval(() => {
      setTimer(prev => {
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, [setTimer]);

  return (
    <NoticeScreen
      title={'Ladataan'}
      bodyText='Istuntosi latautuu. Käytämme ilmaista palvelinta, joten tässä voi mennä yli minuutti.
          Kiitos kärsivällisyydestäsi.'
      footer={
        <Button
          onClick={() => navigate('/')}
          variant='outlined'
          rounded>
          Palaa Etusivulle
        </Button>
      }>
      <SpinnerTimer currentValue={timer} />
    </NoticeScreen>
  );
}
