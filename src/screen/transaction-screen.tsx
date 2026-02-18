import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/modal';
import { useTransactions } from '../providers/transactions-provider';
import { Spinner } from '../components/spinner';

export function TransactionScreen() {
  const navigate = useNavigate();
  const { transactions, transactionsPending } = useTransactions();
  const { id } = useParams();
  const transaction = !transactionsPending ? transactions.find(t => t.id === id) : null;

  return (
    <Modal
      title='Tapahtuma'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col w-full gap-4'>
        {transactionsPending ? (
          <Spinner />
        ) : (
          <>
            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Lähettäjä</span>
              <span>{transaction.from_email}</span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Vastaanottaja</span>
              <span>{transaction.to_email}</span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Määrä</span>
              <span className='font-mono'>
                {Number(transaction.amount_in_cents / 100).toFixed(2)} mk
              </span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Päivämäärä</span>
              <span>{new Date(transaction.timestamp).toLocaleDateString('fi')}</span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Viesti</span>
              <span>{transaction.message || 'Ei viestiä.'}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Tunnus</span>
              <span>{transaction.id}</span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
