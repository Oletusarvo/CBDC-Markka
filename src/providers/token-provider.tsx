import { useQuery } from '@tanstack/react-query';
import { setupContext } from '../util/setup-context';
import { withApi } from '../util/server-config';
import { useSession } from './auth-provider';

const [TokenContext, useTokens] = setupContext<{
  tokens: {
    value_in_cents: number;
    minted_on: Date;
    id: string;
    account_id: string;
  }[];
  isPending: boolean;
}>('TokenContext');

export function TokenProvider({ children }: React.PropsWithChildren) {
  const { session } = useSession();
  const { data: tokens, isPending } = useQuery({
    queryKey: ['tokens', session?.user.id],
    queryFn: async () => {
      const res = await fetch(withApi('currencies/tokens'), {
        credentials: 'include',
      });

      return res.status === 200 ? await res.json() : [];
    },
    refetchInterval: 3000,
  });

  return <TokenContext.Provider value={{ tokens, isPending }}>{children}</TokenContext.Provider>;
}
export { useTokens };
