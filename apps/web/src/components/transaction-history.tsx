import { useQuery } from '@tanstack/react-query';
import { useClassName } from '../hooks/use-class-name';
import { useAccount } from '../providers/account-provider';
import { useSession } from '../providers/auth-provider';
import { withApi } from '../util/server-config';
import { Spinner } from './spinner';
import { ArrowDownCircle, ArrowUpCircle, CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { useTransactions } from '../providers/transactions-provider';
import { useNavigate } from 'react-router-dom';
import { DataContainer } from './data-container';

type TTransaction = {
  id: string;
  from: string;
  from_email: string;
  to_email: string;
  to: string;
  amount_in_cents: number;
  timestamp: number;
  message?: string;
};

export function TransactionHistory() {
  const { transactions, transactionsPending } = useTransactions();
  const today = new Date().toLocaleDateString('fi');
  const dateSet: Set<string> = new Set(
    transactions?.map(t => new Date(t.timestamp).toLocaleDateString('fi')),
  );

  const generateTransactionList = () => {
    const list = [];
    for (const date of dateSet) {
      list.push(
        <>
          <span className='text-slate-500'>{date === today ? 'Tänään' : date}</span>
          {transactions
            .filter(t => new Date(t.timestamp).toLocaleDateString('fi') === date)
            .map(t => {
              return (
                <Transaction
                  data={t}
                  key={`transaction-${t.id}`}
                />
              );
            })}
        </>,
      );
    }
    return list;
  };

  return (
    <div className='flex flex-col w-full gap-2 overflow-y-scroll max-h-full flex-1 rounded-md'>
      {transactionsPending ? (
        <Spinner />
      ) : transactions.length > 0 ? (
        generateTransactionList()
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
    <div
      className='bg-white rounded-md shadow-md py-2 px-4 flex w-full gap-4 items-center cursor-pointer'
      onClick={() => navigate('transaction/' + data.id)}>
      {received ? <ArrowDownCircle color='green' /> : <ArrowUpCircle color='red' />}
      <div className='flex flex-col'>
        <span className={amountClassName}>{amtString} mk</span>

        <span className='text-xs text-slate-500'>{received ? data.from_email : data.to_email}</span>
      </div>
    </div>
  );
}
