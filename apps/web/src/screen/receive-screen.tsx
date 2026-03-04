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
      <div className='flex w-full justify-center flex-col items-center'>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <QRCodeSVG
              className='rounded-md'
              value={session?.user.email}
              fgColor='var(--color-primary)'
              minVersion={5}
            />
            <span className='text-slate-500 mt-4 text-sm'>{session?.user.email}</span>
          </>
        )}
      </div>
    </Modal>
  );
}
