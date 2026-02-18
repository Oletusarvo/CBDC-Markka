import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/modal';
import { useTransactions } from '../providers/transactions-provider';
import { Spinner } from '../components/spinner';
import { useTokens } from '../providers/token-provider';
import { Switch } from '../components/switch';
import { useRef, useState } from 'react';

export function TokenScreen() {
  const navigate = useNavigate();
  const { tokens, isPending } = useTokens();
  const { id } = useParams();
  const token = !isPending ? tokens.find(t => t.id === id) : null;
  const value = token ? token.value_in_cents / 100 : 0;
  const [imageState, setImageState] = useState('loading');

  return (
    <Modal
      title='Seteli'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col w-full gap-4'>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Arvo</span>
              <span>{value.toFixed(2)} mk</span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Vuosiluku</span>
              <span>{new Date(token?.minted_on).getFullYear()}</span>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-slate-500'>Sarjanumero</span>
              <span>{token?.id}</span>
            </div>
            {imageState === 'error' ? (
              <span className='text-slate-500'>Ei Kuvaa.</span>
            ) : (
              <img
                key={token.value_in_cents}
                src={`/coins/bill-${token.value_in_cents}.jpg`}
                onLoad={() => setImageState('loaded')}
                onError={() => setImageState('error')}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
