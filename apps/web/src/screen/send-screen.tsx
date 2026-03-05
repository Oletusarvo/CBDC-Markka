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
  updateCurrentAddress: (e) => void;
  updateStep: (currentStep: number) => void;
}>('SendContext');

export function SendScreen() {
  const { apiInterface } = useApi();
  const { account, sendMoney, isPending: isAccountPending } = useAccount();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const loading = status === 'loading';
  const [currentAddress, setCurrentAddress] = useState('');
  const formRef = useRef(null);
  const [step, setStep] = useState(0);

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

  const updateCurrentAddress = e => {
    setCurrentAddress(e.target.value);
  };

  const updateStep = (currentStep: number) => {
    setStep(currentStep);
  };

  return (
    <SendContext.Provider value={{ status, currentAddress, updateCurrentAddress, updateStep }}>
      <Modal
        title='Lähetä Rahaa'
        onClose={cancel}>
        <form
          className='flex flex-col w-full gap-2'
          onSubmit={handleSubmit}>
          {step === 0 ? (
            <ChooseSendMethod />
          ) : step === 1 ? (
            <QRCodeReadStep
              onScan={data => {
                setCurrentAddress(data);
                setStep(1);
              }}
            />
          ) : (
            <ManualInputStep />
          )}
        </form>
      </Modal>
    </SendContext.Provider>
  );
}

function ChooseSendMethod() {
  const { updateStep } = useSendContext();
  return (
    <div className='flex flex-col gap-2 w-full'>
      <Button
        type='button'
        fullWidth
        rounded
        shadow
        onClick={() => updateStep(1)}>
        Skannaa QR-koodi
      </Button>
      <Button
        type='button'
        fullWidth
        rounded
        shadow
        variant='outlined'
        onClick={() => updateStep(2)}>
        Kirjoita osoite
      </Button>
    </div>
  );
}

function QRCodeReadStep({ onScan }: { onScan: (data) => void }) {
  const { updateStep } = useSendContext();

  return (
    <div className='w-full'>
      <QRScanner onScan={onScan} />
      <div className='flex w-full gap-2'>
        <Button
          fullWidth
          type='button'
          variant='outlined'
          rounded
          onClick={() => updateStep(0)}>
          Takaisin
        </Button>
      </div>
    </div>
  );
}

function ManualInputStep() {
  const { status, currentAddress, updateCurrentAddress, updateStep } = useSendContext();
  const { account, isPending: isAccountPending } = useAccount();
  const balance = isAccountPending ? 0 : account.balance_in_cents;
  const loading = status === 'loading';

  return (
    <>
      <Input
        type='email'
        placeholder='Vastaanottaan sähköpostiosoite...'
        onChange={updateCurrentAddress}
        required
      />

      <Input
        name='amt'
        type='number'
        step={0.01}
        min={0.01}
        max={balance / 100}
        placeholder='Määrä...'
        required
      />

      <textarea
        className='w-full textarea'
        name='message'
        placeholder='Kirjoita viesti...'
        required
        spellCheck={'false'}
      />
      {status === 'transaction:insufficient-funds' ? (
        <ErrorMessage>Saldosi ei riitä!</ErrorMessage>
      ) : status === 'transaction:invalid-recipient' ? (
        <ErrorMessage>Virheellinen vastaanottaja!</ErrorMessage>
      ) : status !== 'idle' && status !== 'loading' ? (
        <ErrorMessage>Jotakin meni pieleen!</ErrorMessage>
      ) : null}
      <div className='flex w-full gap-2'>
        <Button
          fullWidth
          type='button'
          variant='outlined'
          rounded
          onClick={() => updateStep(0)}>
          Takaisin
        </Button>
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
