import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/modal';

import { Spinner } from '../components/spinner';
import { useAccount, useTransactions } from '@cbdc-markka/utils-react';
import { AppScreen } from '../components/app-screen';
import { ArrowDownCircle, ArrowUpCircle, Check, ContainerIcon, Pencil } from 'lucide-react';
import { useClassName } from '../hooks/use-class-name';
import { Button } from '../components/button';
import { useState } from 'react';
import { CurrencySymbol } from '../components/currency';

export function TransactionScreen() {
  const navigate = useNavigate();
  const { account, isPending } = useAccount();
  const { id } = useParams();
  const [status, setStatus] = useState('uncopied');

  const transaction = !isPending ? account.transactions.find(t => t.id === id) : null;
  const isReceived = transaction?.to === account?.id;

  const Symbol = () => {
    const color = isReceived ? 'var(--color-green-600)' : 'var(--color-red-600)';
    const Component = isReceived ? ArrowDownCircle : ArrowUpCircle;
    return (
      <Component
        color={color}
        size='3rem'
      />
    );
  };

  const AmountDisplay = () => {
    const Amount = () => {
      const textClassName = useClassName(
        'text-2xl flex items-center',
        isReceived ? 'text-green-600' : 'text-red-600',
      );
      return (
        <div className={textClassName}>
          {' '}
          <CurrencySymbol /> {Number(transaction?.amount_in_cents / 100).toFixed(2)}
        </div>
      );
    };

    const containerClassName = useClassName(
      'flex gap-4 items-center py-2 px-4 rounded-md border w-full',
      isReceived ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50',
    );

    return (
      <div className={containerClassName}>
        <Symbol />
        <div className='flex flex-col'>
          <span className='text-xs text-slate-500'>
            {isReceived ? transaction?.from : transaction?.to}
          </span>
          <span className='text-xs'>
            {isReceived ? transaction?.from_email : transaction?.to_email}
          </span>

          <Amount />
        </div>
      </div>
    );
  };

  const copyId = async () => {
    if (!transaction) return;

    try {
      setStatus('loading');
      const data = isReceived ? transaction.from : transaction.to;
      await navigator.clipboard.writeText(data);
      setStatus('copied');
    } catch (err) {
      console.log(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'uncopied' : prev));
    }
  };

  return (
    <AppScreen
      title='Tapahtuma'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col w-full gap-4 items-center'>
        <AmountDisplay />
        <div className='flex flex-col w-full'>
          <span className='text-xs text-slate-500'>Viesti</span>
          <span>{transaction?.message || 'Ei viestiä.'}</span>
        </div>

        <div className='flex flex-col w-full'>
          <span className='text-xs text-slate-500'>Päivämäärä</span>
          <span>{new Date(transaction?.timestamp).toLocaleDateString('fi')}</span>
        </div>

        <div className='flex flex-col w-full'>
          <span className='text-xs text-slate-500'>Tunnus</span>
          <span>{transaction?.id}</span>
        </div>

        <Button
          onClick={copyId}
          disabled={status === 'loading' || status === 'copied'}
          color={status === 'copied' ? 'success' : 'primary'}
          type='button'
          variant='outlined'
          rounded>
          {status === 'copied' ? (
            <Check
              size='1rem'
              color='var(--color-green-600)'
            />
          ) : (
            <Pencil
              size='1rem'
              color={'var(--color-primary)'}
            />
          )}

          {status === 'copied'
            ? 'ID Kopioitu!'
            : isReceived
              ? 'Kopioi Lähettäjän ID'
              : 'Kopioi vastaanottajan ID'}
        </Button>
      </div>
    </AppScreen>
  );
}
