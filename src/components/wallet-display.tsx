/**Displays the coins currently owned by the user. */

import { useNavigate } from 'react-router-dom';
import { useTokens } from '../providers/token-provider';
import { Spinner } from './spinner';

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
    <div
      className='flex flex-row w-full bg-white rounded-md shadow-md py-2 px-4 gap-4 items-center cursor-pointer'
      onClick={() => navigate(`/auth/overview/token/${data.id}`)}>
      <div className='flex flex-col'>
        <span className='font-mono'>{value.toFixed(2)} mk</span>
        <span className='text-slate-500 text-xs'>{data.id}</span>
        <span className='text-slate-500 text-xs mt-4'>
          {new Date(data.minted_on).getFullYear()}
        </span>
      </div>
    </div>
  );
}
