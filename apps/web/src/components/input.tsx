import { ReactNode } from 'react';
import { useClassName } from '../hooks/use-class-name';

type InputProps = React.ComponentProps<'input'> & {
  fullWidth?: boolean;
  fontSize?: string | number;
  fontWeight?: number;
  iconComponent?: (props: any) => ReactNode;
};

export function Input({
  fullWidth,
  fontSize,
  fontWeight,
  iconComponent: IconComponent,
  ...props
}: InputProps) {
  const className = useClassName('input pl-12 pr-4 py-4', fullWidth ? 'w-full' : '');
  return (
    <div className='w-full flex items-center border border-slate-200 rounded-md relative overflow-hidden'>
      {IconComponent && (
        <IconComponent
          className='text-slate-500 absolute left-4'
          color='var(--color-slate-500)'
          size={'1.2rem'}
        />
      )}
      <input
        {...props}
        style={{
          fontSize,
          fontWeight,
        }}
        className={className}
      />
    </div>
  );
}
