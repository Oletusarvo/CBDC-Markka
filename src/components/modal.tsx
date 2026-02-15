import { X } from 'lucide-react';
import { Button } from './button';

type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  title: string;
};

export function Modal({ children, title, onClose }: ModalProps) {
  return (
    <div className='absolute top-0 left-0 flex w-screen h-screen z-10 bg-[#0004] backdrop-blur-lg items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg p-4 w-full animate-slide-up'>
        <div className='flex items-center w-full justify-between mb-4'>
          <h3 className='font-semibold'>{title}</h3>
          <Button
            variant='ghost'
            circular
            onClick={() => onClose()}>
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
