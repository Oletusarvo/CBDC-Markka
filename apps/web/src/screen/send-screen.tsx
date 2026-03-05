import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { Send, XCircle } from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
import { Input } from '../components/input';

import { ErrorMessage } from '../components/helper-message';
import { setupContext, useAccount, useApi, useTokens } from '@cbdc-markka/utils-react';
import QRScanner from '../components/qr-scanner';
import { Spinner } from '../components/spinner';

const [SendContext, useSendContext] = setupContext<{
  status: string;
  currentAddress: string;
}>('SendContext');

export function SendScreen() {
  const { apiInterface } = useApi();
  const { account, sendMoney, isPending: isAccountPending } = useAccount();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const loading = status === 'loading';
  const [currentAddress, setCurrentAddress] = useState('');
  const formRef = useRef(null);
  const [step, setStep] = useState(1);

  const cancel = () => navigate('/auth/overview');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await sendMoney({
        amt: data.amt,
        email: currentAddress,
        message: data.message,
      } as any);

      if (res.status === 200) {
        setStatus('success');
        cancel();
      } else if (res.status !== 500) {
        const err = await res.json();
        setStatus(err.error);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <SendContext.Provider value={{ status, currentAddress }}>
      <Modal
        title='Lähetä Rahaa'
        onClose={cancel}>
        <form
          className='flex flex-col w-full gap-2'
          onSubmit={handleSubmit}>
          {step === 0 ? (
            <QRCodeReadStep
              onScan={data => {
                setCurrentAddress(data);
                setStep(1);
              }}
            />
          ) : (
            <AmountAndMessageStep
              onCancel={() => setStep(0)}
              onEmailChanged={e => setCurrentAddress(e.target.value)}
            />
          )}
        </form>
      </Modal>
    </SendContext.Provider>
  );
}

function QRCodeReadStep({ onScan }: { onScan: (data) => void }) {
  return <QRScanner onScan={onScan} />;
}

function AmountAndMessageStep({ onCancel, onEmailChanged }) {
  const { status, currentAddress } = useSendContext();
  const { account, isPending: isAccountPending } = useAccount();
  const balance = isAccountPending ? 0 : account.balance_in_cents;
  const loading = status === 'loading';

  return (
    <>
      <Input
        type='email'
        placeholder='Vastaanottaan sähköpostiosoite...'
        onChange={onEmailChanged}
      />
      <div className='flex flex-col w-full'>
        <Input
          name='amt'
          type='number'
          step={0.01}
          min={0.01}
          max={balance / 100}
          placeholder='Määrä...'
        />

        {status === 'transaction:insufficient-funds' ? (
          <ErrorMessage>Saldosi ei riitä!</ErrorMessage>
        ) : status !== 'idle' && status !== 'loading' ? (
          <ErrorMessage>Jotakin meni pieleen!</ErrorMessage>
        ) : null}
      </div>
      <textarea
        className='w-full textarea'
        name='message'
        placeholder='Kirjoita viesti...'
        required
        spellCheck={'false'}
      />
      <div className='flex w-full gap-2'>
        <LoaderButton
          loading={loading}
          disabled={loading}
          rounded
          type='submit'
          fullWidth>
          Lähetä
        </LoaderButton>
      </div>
    </>
  );
}
