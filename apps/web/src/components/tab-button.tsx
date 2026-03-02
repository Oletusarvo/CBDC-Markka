import { useClassName } from '../hooks/use-class-name';

type TabButtonProps = React.PropsWithChildren & {
  selected?: boolean;
};

export function TabButton({ children, selected }: TabButtonProps) {
  const className = useClassName(
    'w-full border-b-2',
    selected ? 'border-primary' : 'border-transparent',
  );

  return <div className={className}>{children}</div>;
}
