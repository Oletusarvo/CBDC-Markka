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
