import { ReactNode } from 'react';
import { useClassName } from '../hooks/use-class-name';
import { AtSign, Lock } from 'lucide-react';

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
  const className = useClassName(
    'input pr-4 py-2',
    IconComponent ? 'pl-12' : 'pl-4',
    fullWidth ? 'w-full' : '',
  );
  return (
    <div className='w-full flex items-center border border-slate-200 rounded-[100px] relative overflow-hidden'>
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

export type DerivedInputProps = Omit<InputProps, 'name' | 'type' | 'required' | 'iconComponent'>;

export function EmailInput(props: DerivedInputProps) {
  return (
    <Input
      {...props}
      iconComponent={AtSign}
      fullWidth
      name='email'
      type='email'
      required
      placeholder='Sähköpostiosoitteesi...'
    />
  );
}

export function PasswordInput({
  variant,
  ...props
}: DerivedInputProps & { variant?: 'primary' | 'secondary' }) {
  return (
    <Input
      {...props}
      iconComponent={Lock}
      fullWidth
      name={
        variant === 'primary' ? 'password1' : variant === 'secondary' ? 'password2' : 'password'
      }
      type='password'
      required
    />
  );
}
