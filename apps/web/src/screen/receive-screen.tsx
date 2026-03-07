import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { QRCodeSVG } from 'qrcode.react';
import { Spinner } from '../components/spinner';
import { useAccount, useSession } from '@cbdc-markka/utils-react';
import { Input } from '../components/input';
import { useState } from 'react';
import { AppScreen } from '../components/app-screen';
import QrScanner from 'qr-scanner';
import { Button } from '../components/button';

export function ReceiveScreen() {
  const { session } = useSession();
  const [amount, setAmount] = useState(null);
  const { account, isPending } = useAccount();
  const navigate = useNavigate();

  return (
    <AppScreen
      title='Vastaanota Rahaa'
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col gap-8 items-center'>
        <p className='text-slate-500 text-sm text-center'>
          Jaa tämä qr-koodi rahan lähettäjän kanssa. Saat maksun välittömästi.
        </p>
        <div className='flex flex-col gap-2 w-full'>
          <label className='font-semibold text-sm'>Anna määrä (vaihtoehtoinen)</label>
          <Input
            fontSize={18}
            fontWeight={600}
            max={account?.balance_in_cents}
            onChange={e => {
              setAmount(e.target?.valueAsNumber || null);
            }}
            type='number'
            min={0.01}
            step={0.01}
            placeholder='Kirjoita määrä...'
            fullWidth
          />
        </div>
        <div className='flex flex-col w-full gap-4 items-center'>
          <QRCodeSVG
            value={`mrk:${session?.user.email}:${amount ? amount * 100 : 'null'}`}
            size={150}
          />
          <div className='flex flex-col w-full items-center'>
            <h3 className='font-semibold'>{session?.user.email}</h3>
            <span className='text-slate-500 text-xs'>{session?.user.id}</span>
          </div>

          {amount && <span className='text-xl font-semibold'>₥{Number(amount).toFixed(2)}</span>}
        </div>
      </div>
    </AppScreen>
  );
}
