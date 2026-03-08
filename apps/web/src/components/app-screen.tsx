import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from './button';

export type AppScreenProps = React.PropsWithChildren & {
  title: string;
  onClose: () => void;
};

export function AppScreen({ title, onClose, children }: AppScreenProps) {
  return (
    <div className='fixed top-0 left-0 z-20 w-full h-full bg-white animate-scale-in'>
      <div className='flex p-4 w-full items-center gap-2'>
        <Button
          onClick={onClose}
          variant='ghost'
          circular>
          <ChevronLeft />
        </Button>
        <h2 className='font-semibold text-lg'>{title}</h2>
      </div>
      <div className='flex w-full flex-1 p-4 h-full'>{children}</div>
    </div>
  );
}
