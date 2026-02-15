import { useClassName } from '../hooks/use-class-name';

type InputProps = React.ComponentProps<'input'> & {
  fullWidth?: boolean;
};

export function Input({ fullWidth, ...props }: InputProps) {
  const className = useClassName('input', fullWidth ? 'w-full' : '');
  return (
    <input
      {...props}
      className={className}
    />
  );
}
