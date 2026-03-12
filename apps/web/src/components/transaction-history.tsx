import { useClassName } from '../hooks/use-class-name';

import { Spinner } from './spinner';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAccount, useTransactions } from '@cbdc-markka/utils-react';
import { CurrencySymbol } from './currency';

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
  const { account, isPending } = useAccount();

  const today = new Date().toLocaleDateString('fi');
  const dateSet: Set<string> = new Set(
    account?.transactions?.map(t => new Date(t.timestamp).toLocaleDateString('fi')),
  );

  const generateTransactionList = () => {
    const list = [];
    for (const date of dateSet) {
      list.push(
        <>
          <span className='text-slate-500'>{date === today ? 'Tänään' : date}</span>
          {account?.transactions
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
    <>
      {isPending ? (
        <Spinner />
      ) : account?.transactions.length > 0 ? (
        generateTransactionList()
      ) : (
        <div className='flex flex-col justify-center items-center flex-1'>
          <h2 className='text-sm text-slate-500'>Ei tapahtumia.</h2>
        </div>
      )}
    </>
  );
}

function Transaction({ data }: { data: TTransaction }) {
  const { account } = useAccount();
  const navigate = useNavigate();
  const received = data.to === account?.id;
  const amt = (data.amount_in_cents / 100).toFixed(2);

  const amountClassName = useClassName(
    received ? 'text-green-400' : 'text-red-400',
    'font-mono flex gap-2 items-center',
  );
  const amtString = received ? `+` : `-`;
  return (
    <div
      className='bg-white py-2 px-4 flex w-full gap-4 items-center cursor-pointer border-b border-slate-200'
      onClick={() => navigate('transaction/' + data.id)}>
      {received ? <ArrowDownCircle color='green' /> : <ArrowUpCircle color='red' />}
      <div className='flex flex-col'>
        <div className={amountClassName}>
          <span>{amtString}</span>
          <div className='flex items-center gap-1'>
            <CurrencySymbol size='var(--text-sm)' />
            <span>{amt}</span>
          </div>
        </div>

        <span className='text-xs text-slate-500'>{received ? data.from_email : data.to_email}</span>
      </div>
    </div>
  );
}
