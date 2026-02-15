import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount } from '../providers/account-provider';
import { Spinner } from '../components/spinner';
import { useSession } from '../providers/auth-provider';

export function ReceiveScreen() {
  const { session } = useSession();
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
              value={account?.id}
              fgColor='green'
              minVersion={5}
            />
            <span className='text-slate-500 mt-4'>{session?.user.email}</span>
          </>
        )}
      </div>
    </Modal>
  );
}
