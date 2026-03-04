import { useQuery } from '@tanstack/react-query';
import { useSession } from './auth-provider';
import { setupContext } from '../util/setup-context';
import { ApiInterface } from '@cbdc-markka/utils-api';
import { useApi } from './api-provider';

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
  const { apiInterface } = useApi();
  const { session } = useSession();
  const { data: tokens, isPending } = useQuery({
    queryKey: ['tokens', session?.user.id],
    queryFn: async () => {
      const res = await fetch(apiInterface.withApi('currencies/tokens'), {
        credentials: 'include',
      });

      return res.status === 200 ? await res.json() : [];
    },
    refetchInterval: 10000,
  });

  return <TokenContext.Provider value={{ tokens, isPending }}>{children}</TokenContext.Provider>;
}
export { useTokens };
