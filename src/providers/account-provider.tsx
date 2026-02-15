import { setupContext } from '../util/setup-context';
import { useSession } from './auth-provider';
import { useQuery } from '@tanstack/react-query';
import { withApi } from '../util/server-config';

const [AccountContext, useAccount] = setupContext<{
  account: {
    balance_in_cents: number;
    id: string;
  };
  isPending: boolean;
}>('AccountContext');

export function AccountProvider({ children }: React.PropsWithChildren) {
  const { session } = useSession();
  const { data: account, isPending } = useQuery({
    queryKey: [session?.user.id, 'account'],
    queryFn: async () => {
      const res = await fetch(withApi('accounts'), {
        method: 'GET',
        credentials: 'include',
      });
      return res.status === 200 ? await res.json() : null;
    },
  });

  return (
    <AccountContext.Provider
      value={{
        account,
        isPending,
      }}>
      {children}
    </AccountContext.Provider>
  );
}

export { useAccount };
