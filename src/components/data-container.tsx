export function DataContainer({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className='relative overflow-hidden flex flex-row w-full bg-white rounded-md shadow-md py-2 px-4 gap-4 cursor-pointer shrink-0'>
      <div className='absolute top-0 left-0 bg-primary w-1 h-full' />
      {children}
    </div>
  );
}
