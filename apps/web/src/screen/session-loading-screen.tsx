import { useEffect, useState } from 'react';
import { Spinner } from '../components/spinner';
import { AppIcon } from '../components/app-icon';

export function SessionLoadingScreen() {
  const [timer, setTimer] = useState(60);

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
    <div className='flex flex-col w-full flex-1 items-center justify-center p-4 animate-scale-in'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <AppIcon />
        <Spinner variant='large' />
        <h2 className='text-xl text-primary font-semibold'>Ladataan</h2>
        <p className='text-sm text-slate-500 text-center'>
          Istuntosi latautuu. Käytämme ilmaista palvelinta, joten tässä voi mennä yli minuutti.
          Kiitos kärsivällisyydestäsi.
        </p>
        <span className='text-2xl font-semibold text-slate-500'>{timer}</span>
      </div>
    </div>
  );
}
