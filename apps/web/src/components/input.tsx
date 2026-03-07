import { useClassName } from '../hooks/use-class-name';

type InputProps = React.ComponentProps<'input'> & {
  fullWidth?: boolean;
  fontSize?: string | number;
  fontWeight?: number;
};

export function Input({ fullWidth, fontSize, fontWeight, ...props }: InputProps) {
  const className = useClassName('input', fullWidth ? 'w-full' : '');
  return (
    <input
      {...props}
      style={{
        fontSize,
        fontWeight,
      }}
      className={className}
    />
  );
}
