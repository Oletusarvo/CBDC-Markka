import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}
