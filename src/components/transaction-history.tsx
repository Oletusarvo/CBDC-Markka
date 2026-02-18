import { useQuery } from '@tanstack/react-query';
import { useClassName } from '../hooks/use-class-name';
import { useAccount } from '../providers/account-provider';
import { useSession } from '../providers/auth-provider';
import { withApi } from '../util/server-config';
import { Spinner } from './spinner';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { useTransactions } from '../providers/transactions-provider';
import { useNavigate } from 'react-router-dom';
import { DataContainer } from './data-container';

type TTransaction = {
  id: string;
  from: string;
  to: string;
  amount_in_cents: number;
  timestamp: number;
  message?: string;
};

export function TransactionHistory() {
  const { transactions, transactionsPending } = useTransactions();

  return (
    <div className='flex flex-col w-full gap-2 overflow-y-scroll max-h-full flex-1 rounded-md'>
      {transactionsPending ? (
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
  const navigate = useNavigate();
  const received = data.to === account?.id;
  const amt = (data.amount_in_cents / 100).toFixed(2);

  const amountClassName = useClassName(received ? 'text-green-400' : 'text-red-400', 'font-mono');
  const amtString = received ? `+${amt}` : `-${amt}`;
  return (
    <DataContainer onClick={() => navigate(`/auth/overview/transaction/${data.id}`)}>
      <div className='flex flex-col w-full'>
        <span className={amountClassName}>{amtString} mk</span>

        <p className='text-slate-500 text-sm'>{data.message || 'No message.'}</p>
        <span className='text-xs text-slate-500'>
          {new Date(data.timestamp).toLocaleDateString('fi')}
        </span>
      </div>
    </DataContainer>
  );
}
