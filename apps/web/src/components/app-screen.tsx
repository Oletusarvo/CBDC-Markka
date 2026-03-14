import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from './button';

export type AppScreenProps = React.PropsWithChildren &
  (
    | {
        headerShown?: boolean;
      }
    | {
        title: string;
        headerShown: true;
        onClose: () => void;
      }
  );

export function AppScreen({ headerShown = true, children, ...props }: AppScreenProps) {
  const { title, onClose } = headerShown ? props : ({ title: null, onClose: null } as any);

  return (
    <div className='z-20 w-full flex-1 bg-white animate-scale-in h-full flex flex-col'>
      {headerShown && (
        <div className='flex p-4 w-full items-center gap-2'>
          <Button
            onClick={onClose}
            variant='ghost'
            circular>
            <ChevronLeft />
          </Button>
          <h2 className='font-semibold text-lg'>{title}</h2>
        </div>
      )}

      {children}
    </div>
  );
}
