import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { QRCodeSVG } from 'qrcode.react';
import { Spinner } from '../components/spinner';
import { useAccount, useSession } from '@cbdc-markka/utils-react';
import { Input } from '../components/input';
import { useState } from 'react';

export function ReceiveScreen() {
  const { session } = useSession();
  const [amount, setAmount] = useState(0.01);
  const { account, isPending } = useAccount();
  const navigate = useNavigate();

  return (
    <Modal
      title={'Pyydä Rahaa'}
      onClose={() => navigate('/auth/overview')}>
      <div className='flex w-full justify-center flex-col items-center gap-2'>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <QRCodeSVG
              className='rounded-md'
              value={`mrk:${session?.user.email}:${amount * 100}:`}
              fgColor='var(--color-primary)'
              minVersion={3}
            />
            <span className='text-slate-500 mt-4 text-sm'>{session?.user.email}</span>
            <Input
              onChange={e => setAmount(e.target.valueAsNumber)}
              type='number'
              fullWidth
              min={0.01}
              placeholder='Anna määrä...'
              required
            />
          </>
        )}
      </div>
    </Modal>
  );
}
