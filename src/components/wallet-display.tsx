/**Displays the coins currently owned by the user. */

import { useNavigate } from 'react-router-dom';
import { useTokens } from '../providers/token-provider';
import { Spinner } from './spinner';
import { DataContainer } from './data-container';

export function WalletDisplay() {
  const { tokens, isPending } = useTokens();
  return (
    <div className='flex flex-col w-full gap-2 overflow-y-scroll max-h-full flex-1 rounded-md'>
      {isPending ? (
        <Spinner />
      ) : tokens.length > 0 ? (
        tokens.map((t, i) => (
          <Token
            data={t}
            key={`transaction-${i}`}
          />
        ))
      ) : (
        <div className='flex flex-col justify-center items-center flex-1'>
          <h2 className='text-sm text-slate-500'>Lompakkosi on tyhjä.</h2>
        </div>
      )}
    </div>
  );
}

function Token({ data }: { data: any }) {
  const value = data.value_in_cents / 100;
  const navigate = useNavigate();
  return (
    <DataContainer onClick={() => navigate(`/auth/overview/token/${data.id}`)}>
      <div className='absolute top-0 left-0 bg-primary w-1 h-full' />
      <div className='flex flex-col'>
        <img
          src={`/coins/bill-${data.value_in_cents}.jpg`}
          width={120}
        />
      </div>
      <div className='flex flex-col'>
        <span className='font-mono text-blue-500'>{value.toFixed(2)} mk</span>
        <span className='text-slate-500 text-xs'>{new Date(data.minted_on).getFullYear()}</span>
      </div>
    </DataContainer>
  );
}
