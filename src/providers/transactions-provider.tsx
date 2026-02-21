import { useQuery } from '@tanstack/react-query';
import { setupContext } from '../util/setup-context';
import { useAccount } from './account-provider';
import { withApi } from '../util/server-config';

const [TransactionsContext, useTransactions] = setupContext<{
  transactions: any[];
  transactionsPending: boolean;
}>('TransactionsContext');

export function TransactionsProvider({ children }: React.PropsWithChildren) {
  const { account } = useAccount();
  const { data: transactions, isPending: transactionsPending } = useQuery({
    queryKey: ['transactions', account?.id],
    queryFn: async () => {
      const res = await fetch(withApi('accounts/transactions'), {
        method: 'GET',
        credentials: 'include',
      });

      return res.status === 200 ? await res.json() : [];
    },
    refetchInterval: 10000,
  });

  return (
    <TransactionsContext.Provider value={{ transactions, transactionsPending }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export { useTransactions };
