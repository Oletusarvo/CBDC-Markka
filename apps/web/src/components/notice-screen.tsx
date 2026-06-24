import { ReactNode } from 'react';
import { AppIcon } from './app-icon';
import { AppScreen } from './app-screen';

export type NoticeScreenProps = React.PropsWithChildren & {
  title: string;
  bodyText: string;
  footer?: ReactNode;
};

export function NoticeScreen({ title, bodyText, footer, children }: NoticeScreenProps) {
  return (
    <AppScreen headerShown={false}>
      <div className='flex flex-col w-full flex-1 items-center justify-center p-4 gap-8'>
        <div className='flex flex-col gap-4 items-center justify-center'>
          <AppIcon />
          <div className='flex items-center'>
            <h2 className='text-xl text-primary font-semibold'>{title}</h2>
          </div>

          <p className='text-sm text-slate-500 text-center'>{bodyText}</p>
          {children}
        </div>

        {footer}
      </div>
    </AppScreen>
  );
}
