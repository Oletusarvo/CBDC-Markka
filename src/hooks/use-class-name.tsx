export function useClassName(...className: string[]) {
  return className.join(' ').trim();
}
