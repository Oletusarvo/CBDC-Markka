import { useSession } from './auth-provider';
import { useQuery } from '@tanstack/react-query';
import { setupContext } from '../util/setup-context';
import { ApiInterface } from '@cbdc-markka/utils-api';
import { useApi } from './api-provider';

const [AccountContext, useAccount] = setupContext<{
  account: {
    balance_in_cents: number;
    id: string;
    transactions: any[];
  };
  isPending: boolean;
  sendMoney: (data: { amt: number }) => Promise<Response>;
}>('AccountContext');

export function AccountProvider({ children }: React.PropsWithChildren) {
  const { apiInterface } = useApi();
  const { session } = useSession();
  const {
    data: account,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [session?.user.id, 'account'],
    queryFn: async () => {
      const res = await fetch(apiInterface.withApi('accounts'), {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        return await res.json();
      }

      return null;
    },

    refetchInterval: 20000,
  });

  const sendMoney = async (data: any) => {
    const res = await fetch(apiInterface.withApi('transactions'), {
      method: 'POST',
      body: JSON.stringify({
        amt: data.amt,
        email: data.email.trim(),
        message: data.message,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      await refetch();
    }
    return res;
  };

  return (
    <AccountContext.Provider
      value={{
        account,
        isPending,
        sendMoney,
      }}>
      {children}
    </AccountContext.Provider>
  );
}

export { useAccount };
