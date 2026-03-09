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
  createTransaction: (data: { amt: number }) => Promise<Response>;
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
      const res = await apiInterface.getAccount();

      if (res.ok) {
        return await res.json();
      }

      return null;
    },

    refetchInterval: 20000,
    retryDelay: 15000,
  });

  const createTransaction = async (data: any) => {
    const res = await apiInterface.createTransaction({
      amt: data.amt,
      recipient_id: data.recipient_id,
      message: data.message,
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
        createTransaction,
      }}>
      {children}
    </AccountContext.Provider>
  );
}

export { useAccount };
