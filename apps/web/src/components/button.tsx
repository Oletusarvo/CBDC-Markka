import { withLoader } from '../hoc/withLoader';
import { useClassName } from '../hooks/use-class-name';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'contained' | 'outlined' | 'ghost';
  color?: 'primary' | 'primary-pretty';
  fullWidth?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  circular?: boolean;
};

export function Button({
  children,
  variant = 'contained',
  fullWidth,
  shadow,
  rounded,
  circular,
  color = 'primary',
  ...props
}: ButtonProps) {
  const className = useClassName(
    'button',
    `--${variant}`,
    `--${color}`,
    fullWidth ? 'w-full' : '',
    shadow ? 'shadow-md' : '',
    rounded ? 'rounded-md' : '',
    circular ? 'rounded-full aspect-square' : '',
  );
  return (
    <button
      {...props}
      className={className}>
      {children}
    </button>
  );
}

export const LoaderButton = withLoader(Button);
