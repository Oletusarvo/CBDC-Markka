import { Circle, Triangle } from 'lucide-react';
import { useClassName } from '../hooks/use-class-name';

type TabButtonProps = React.PropsWithChildren & {
  selected?: boolean;
  color?: 'primary' | 'white';
};

export function TabButton({ children, selected, color = 'primary' }: TabButtonProps) {
  const className = useClassName(
    'w-full border-b-2 relative flex items-center',
    selected
      ? color === 'white'
        ? 'border-white bg-white/10'
        : 'border-primary bg-primary/10'
      : 'border-transparent',
  );

  return <div className={className}>{children} </div>;
}
