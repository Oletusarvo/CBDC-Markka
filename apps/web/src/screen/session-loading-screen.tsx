import { useEffect, useState } from 'react';
import { Spinner } from '../components/spinner';
import { AppIcon } from '../components/app-icon';
import { Button } from '../components/button';
import { useNavigate } from 'react-router-dom';

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
    <div className='flex flex-col w-full flex-1 items-center justify-center p-4 animate-scale-in gap-8'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <AppIcon />
        <div className='flex items-center'>
          <h2 className='text-xl text-primary font-semibold'>Ladataan</h2>
        </div>

        <p className='text-sm text-slate-500 text-center'>
          Istuntosi latautuu. Käytämme ilmaista palvelinta, joten tässä voi mennä yli minuutti.
          Kiitos kärsivällisyydestäsi.
        </p>
        <div className='relative flex items-center justify-center flex-col'>
          <div className='absolute w-12 h-12 rounded-full border-2 border-white border-t-primary animate-spin'></div>

          <span className='text-xl font-semibold text-slate-500'>{timer}</span>
        </div>
      </div>

      <Button
        onClick={() => navigate('/')}
        variant='outlined'
        rounded>
        Palaa Etusivulle
      </Button>
    </div>
  );
}
