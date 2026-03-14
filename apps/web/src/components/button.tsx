import { withLoader } from '../hoc/withLoader';
import { useClassName } from '../hooks/use-class-name';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'contained' | 'outlined' | 'ghost';
  color?: 'primary' | 'primary-pretty' | 'white' | 'success';
  compact?: boolean;
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
  compact,
  circular,
  color = 'primary',
  ...props
}: ButtonProps) {
  const className = useClassName(
    'button',
    compact ? 'p-2' : 'px-4 py-2',
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
