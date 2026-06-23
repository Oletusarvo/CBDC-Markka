export function Form({ children, ...props }: Omit<React.ComponentProps<'form'>, 'className'>) {
  return (
    <form
      {...props}
      className='flex flex-col gap-2 w-full'>
      {children}
    </form>
  );
}
