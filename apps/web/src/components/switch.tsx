import { useClassName } from '../hooks/use-class-name';

type SwitchProps = {
  active?: boolean;
};
export function Switch({ active = false }) {
  const className = useClassName(
    'absolute top-0 rounded-full bg-primary w-4 h-4',
    active ? 'right-0' : 'left-0',
  );

  return (
    <div className='relative w-8 h-4 rounded-[100px] bg-gray-300 flex items-center'>
      <div className={className} />
    </div>
  );
}
