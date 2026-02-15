import { useQuery } from '@tanstack/react-query';
import { useClassName } from '../hooks/use-class-name';
import { useAccount } from '../providers/account-provider';
import { useSession } from '../providers/auth-provider';
import { withApi } from '../util/server-config';
import { Spinner } from './spinner';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

type TTransaction = {
  id: string;
  from: string;
  to: string;
  amount_in_cents: number;
  timestamp: number;
  message?: string;
};

export function TransactionHistory() {
  const { session } = useSession();
  const { data: transactions, isPending } = useQuery({
    queryKey: ['transactions', session?.user.id],
    queryFn: async () => {
      const res = await fetch(withApi('accounts/transactions'), {
        credentials: 'include',
      });
      return res.status === 200 ? await res.json() : [];
    },
    refetchInterval: 30000,
  });

  return (
    <div className='flex flex-col w-full gap-2 overflow-y-scroll max-h-full flex-1 rounded-md'>
      {isPending ? (
        <Spinner />
      ) : transactions.length > 0 ? (
        transactions.map((t, i) => (
          <Transaction
            data={t}
            key={`transaction-${i}`}
          />
        ))
      ) : (
        <div className='flex flex-col justify-center items-center flex-1'>
          <h2 className='text-sm text-slate-500'>Ei tapahtumia.</h2>
        </div>
      )}
    </div>
  );
}

function Transaction({ data }: { data: TTransaction }) {
  const { account } = useAccount();
  const received = data.to === account?.id;
  const amt = (data.amount_in_cents / 100).toFixed(2);

  const amountClassName = useClassName(received ? 'text-green-400' : 'text-red-400', 'font-mono');
  const amtString = received ? `+${amt}` : `-${amt}`;
  return (
    <div className='flex flex-row w-full bg-white rounded-md shadow-md py-2 px-4 gap-4 items-center'>
      {received ? (
        <CircleArrowDown
          className='text-green-400'
          size={32}
        />
      ) : (
        <CircleArrowUp
          className='text-red-400'
          size={32}
        />
      )}
      <div className='flex flex-col w-full'>
        <span className={amountClassName}>{amtString} mk</span>

        <p className='text-slate-500 text-sm'>{data.message || 'No message.'}</p>
        <span className='text-xs text-slate-500'>
          {new Date(data.timestamp).toLocaleDateString('fi')}
        </span>
      </div>
    </div>
  );
}
