import { useClassName } from '../hooks/use-class-name';

import { Spinner } from './spinner';
import { ArrowDown, ArrowDownCircle, ArrowUp, ArrowUpCircle } from 'lucide-react';

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
        account?.transactions.map((t, i) => (
          <Transaction
            data={t}
            key={i}
          />
        ))
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
  const amt = (data.amount_in_cents / 100) * (received ? 1 : -1);

  const amountClassName = useClassName(
    received ? 'text-green-600' : 'text-slate-600',
    'font-mono flex gap-2 items-center text-sm',
  );

  return (
    <div
      className='bg-white py-4 px-4 flex w-full gap-4 items-center cursor-pointer border-b border-slate-200 justify-between'
      onClick={() => navigate('/auth/transaction/' + data.id)}>
      <div className='flex items-center gap-4'>
        {received ? <ArrowDown className='text-green-600' /> : <ArrowUp className='text-red-600' />}
        <div className='flex flex-col'>
          <span className='text-xs'>{new Date(data.timestamp).toLocaleDateString('fi')}</span>
          <span className='text-xs text-slate-500'>
            {received ? data.from_email : data.to_email}
          </span>
        </div>
      </div>
      <div className={amountClassName}>
        <div className='flex items-baseline'>
          <span>
            {Number(amt).toLocaleString('fi', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              signDisplay: 'always',
            })}{' '}
            mk
          </span>
        </div>
      </div>
    </div>
  );
}
