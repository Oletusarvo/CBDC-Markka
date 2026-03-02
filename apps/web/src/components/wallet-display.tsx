/**Displays the coins currently owned by the user. */

import { useNavigate } from 'react-router-dom';
import { useTokens } from '../providers/token-provider';
import { Spinner } from './spinner';
import { DataContainer } from './data-container';
import { useClassName } from '../hooks/use-class-name';

const denomColor: { [x: number]: { border: string; bg: string; text: string } } = {
  1: {
    border: 'yellow-100',
    bg: 'yellow-50',
    text: 'yellow-700',
  },
  2: {
    border: 'red-100',
    bg: 'red-50',
    text: 'red-700',
  },
};

export function WalletDisplay() {
  const { tokens, isPending } = useTokens();
  return (
    <div className='flex flex-col gap-2 w-full overflow-x-scroll max-h-full h-full flex-1'>
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
  const getColors = (): { value: string; bg: string; border: string } => {
    switch (data.value_in_cents) {
      case 1:
        return { value: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-100' };

      case 2:
        return { value: 'text-zinc-700', bg: 'bg-zinc-50', border: 'border-zinc-100' };

      case 5:
        return { value: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-100' };

      case 10:
        return { value: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-100' };

      case 20:
        return { value: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' };

      case 50:
        return { value: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100' };

      case 100:
        return { value: 'text-stone-700', bg: 'bg-stone-50', border: 'border-stone-100' };

      case 200:
        return { value: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' };

      case 500:
        return { value: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-100' };

      case 1000:
        return { value: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' };

      case 2000:
        return { value: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' };

      case 5000:
        return { value: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-1000' };

      case 10000:
        return { value: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' };

      default:
        return { value: 'text-gray-700', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };
  const colors = getColors();
  const valueClassName = useClassName('text-3xl font-semibold z-10', colors.value);
  const containerClassName = useClassName(
    'gap-2 flex shrink-0 relative p-2 w-full rounded-md border overflow-hidden flex-col shadow-md justify-center',
    colors.border,
    colors.bg,
  );

  return (
    <div className={containerClassName}>
      <span className='text-slate-400 text-xs font-mono z-10'>{data.id}</span>
      <div className={valueClassName}>
        {value.toFixed(2)}
        <span className='text-sm'>mk</span>
      </div>
      <span className='text-xs text-slate-400 z-10'>Minted {data.minted_on}</span>
      <div className='z-10 absolute right-2 bg-linear-to-b from-slate-300 via-white to-gray-300 bg-clip-text select-none'>
        <span className='token-value text-7xl font-semibold font-playfair text-transparent'>
          <span className='text-4xl'>₵</span>
          {data.value_in_cents}
        </span>
      </div>
    </div>
  );
}
