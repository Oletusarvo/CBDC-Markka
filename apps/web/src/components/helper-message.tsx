export function ErrorMessage({ children }: React.PropsWithChildren) {
  return <span className='text-xs text-red-600 ml-1'>{children}</span>;
}
