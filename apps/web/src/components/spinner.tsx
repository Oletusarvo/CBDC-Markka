import { useClassName } from '../hooks/use-class-name';

type SpinnerProps = {
  variant?: 'default' | 'large';
};
export function Spinner({ variant = 'default' }: SpinnerProps) {
  const className = useClassName(
    'border-2 border-white border-t-primary rounded-full animate-spin',
    variant === 'default' ? 'w-4 h-4' : 'w-8 h-8',
  );
  return <div className={className} />;
}

export type SpinnerTimerProps = {
  currentValue?: number;
};

export function SpinnerTimer({ currentValue }: SpinnerTimerProps) {
  return (
    <div className='relative flex items-center justify-center flex-col'>
      <div className='absolute w-12 h-12 rounded-full border-2 border-white border-t-primary animate-spin'></div>
      <span className='text-xl font-semibold text-slate-500'>{currentValue}</span>
    </div>
  );
}
