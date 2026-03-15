import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from './button';
import { ReactNode } from 'react';

export type AppScreenProps = React.PropsWithChildren &
  (
    | {
        headerShown?: boolean;
      }
    | {
        title: string;
        headerShown: true;
        onClose?: () => void;
      }
  );

export function AppScreen({ headerShown = true, children, ...props }: AppScreenProps) {
  const { title, onClose } = headerShown ? props : ({ title: null, onClose: null } as any);

  return (
    <div className='z-20 w-full flex-1 animate-scale-in h-full flex flex-col'>
      {headerShown && (
        <div className='flex p-4 w-full items-center gap-2 bg-white'>
          {onClose && (
            <Button
              compact
              onClick={onClose}
              variant='ghost'
              circular>
              <ChevronLeft />
            </Button>
          )}

          <h2 className='font-semibold text-slate-500'>{title}</h2>
        </div>
      )}

      {children}
    </div>
  );
}

type DividedAppScreenProps = Omit<AppScreenProps, 'title' | 'onClick'> & {
  headerContent: ReactNode;
};

export function DividedAppScreen({ children, headerContent, ...props }: DividedAppScreenProps) {
  return (
    <AppScreen headerShown={false}>
      <div className='flex flex-col w-full bg-linear-to-b from-primary to-indigo-500 flex-1 h-full'>
        <div className='w-full flex py-12 px-4 items-center justify-between'>{headerContent}</div>
        <div className='w-full flex-1 flex-col flex bg-slate-50 overflow-y-scroll rounded-t-2xl h-full'>
          {children}
        </div>
      </div>
    </AppScreen>
  );
}
