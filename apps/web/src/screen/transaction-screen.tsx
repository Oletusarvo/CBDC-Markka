import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/modal';

import { Spinner } from '../components/spinner';
import { useAccount, useTransactions } from '@cbdc-markka/utils-react';
import { AppScreen } from '../components/app-screen';
import { ArrowDownCircle, ArrowUpCircle, Check, ContainerIcon, Pencil } from 'lucide-react';
import { useClassName } from '../hooks/use-class-name';
import { Button } from '../components/button';
import { useState } from 'react';
import { Core } from '@cbdc-markka/core';

export function TransactionScreen() {
  const navigate = useNavigate();
  const { account, isPending } = useAccount();
  const { id } = useParams();
  const [status, setStatus] = useState('uncopied');

  const transaction = account?.transactions.find(t => t.id === id);
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

  const AmountText = () => {
    const textClassName = useClassName(isReceived ? 'text-green-600' : 'text-red-600');

    const amt = Core.convertCurrencyAmount(transaction?.amount_in_cents || 0);
    return (
      <div className={textClassName}>
        {Core.amountToString(isReceived ? amt : -amt, 'always')} mk
      </div>
    );
  };

  const AmountDisplay = () => {
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

          <AmountText />
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

  if (isPending) {
    return <Spinner />;
  }

  return (
    <AppScreen
      title='Tapahtuma'
      onClose={() => navigate('/auth/overview')}>
      <main className='flex flex-col w-full gap-4 items-center px-4 bg-white flex-1 justify-center'>
        <Symbol />
        <h2 className='font-semibold text-lg'>Rahansiirto</h2>
        <div className='flex flex-col w-full py-1'>
          <div className='flex flex-col'>
            <span className='font-semibold text-sm'>Rahasiirron Tunnus</span>
            <span>{transaction?.id}</span>
          </div>
          <div className='flex flex-col py-1'>
            <span className='font-semibold text-sm'>
              {isReceived ? 'Lähettäjä' : 'Vastaanottaja'}
            </span>
            <span> {isReceived ? transaction.from_email : transaction.to_email}</span>
          </div>
        </div>
        <div className='w-full border-b border-dashed border-gray-500' />
        <table className='w-full'>
          <tbody className='font-mono'>
            <tr>
              <td>Määrä</td>
              <td className='text-right'>
                <AmountText />
              </td>
            </tr>

            <tr className='bg-slate-200'>
              <td>Päivämäärä</td>
              <td className='text-right'>
                {new Date(transaction?.timestamp).toLocaleDateString('fi')}
              </td>
            </tr>

            <tr>
              <td className='align-text-top'>Viesti</td>
              <td className='text-right'>{transaction?.message || 'Ei viestiä.'}</td>
            </tr>
          </tbody>
        </table>

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
      </main>
    </AppScreen>
  );
}
