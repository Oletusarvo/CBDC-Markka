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
import { Check, CurrencyIcon, DollarSign, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useClassName } from '../hooks/use-class-name';
import { appConfig } from '../app-config';

export function ReceiveScreen() {
  const { session } = useSession();
  const [idCopyStatus, setIdCopyStatus] = useState('uncopied');
  const [amount, setAmount] = useState(null);
  const { account, isPending } = useAccount();
  const navigate = useNavigate();

  const copyId = async () => {
    if (!account) return;

    try {
      setIdCopyStatus('loading');
      await navigator.clipboard.writeText(account.id);
      setIdCopyStatus('copied');
    } catch (err) {
      toast.error('Jotakin meni pieleen!');
    } finally {
      setIdCopyStatus(prev => (prev === 'loading' ? 'uncopied' : prev));
    }
  };
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
            iconComponent={props => <div {...props}>{appConfig.currencySymbol}</div>}
            fontSize={18}
            fontWeight={600}
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
            value={`mrk:${account?.id}:${amount ? amount * 100 : 'null'}`}
            size={150}
          />
          {amount && (
            <div className='text-xl font-semibold flex items-center'>
              {appConfig.currencySymbol}
              <span>{Number(amount).toFixed(2)}</span>
            </div>
          )}
          <div className='flex flex-col w-full items-center gap-2'>
            <div className='flex flex-col items-center'>
              <h3 className='font-semibold'>{session?.user.email}</h3>
              <span className='text-slate-500 text-xs'>{account?.id}</span>
            </div>

            <Button
              onClick={copyId}
              rounded
              disabled={idCopyStatus === 'loading' || idCopyStatus === 'copied' || !account}
              type='button'
              variant='outlined'
              color={idCopyStatus === 'copied' ? 'success' : 'primary'}>
              {idCopyStatus === 'copied' ? (
                <>
                  <Check
                    size='1rem'
                    color='var(--color-green-600)'
                  />{' '}
                  ID Kopioitu!
                </>
              ) : (
                <>
                  <Pencil
                    size='1rem'
                    color='var(--color-primary)'></Pencil>
                  Kopioi ID
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
