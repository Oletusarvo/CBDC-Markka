import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { ArrowLeft, AtSign, Check, QrCode, Send, XCircle } from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
import { Input } from '../components/input';

import { ErrorMessage } from '../components/helper-message';
import { setupContext, useAccount, useApi, useTokens } from '@cbdc-markka/utils-react';
import QRScanner from '../components/qr-scanner';
import { Spinner } from '../components/spinner';
import { AppScreen } from '../components/app-screen';
import { TabButton } from '../components/tab-button';

const [SendContext, useSendContext] = setupContext<{
  status: string;
  currentAddress: string;
  currentAmount: number;
  updateCurrentAddress: (e) => void;
  updateStep: (currentStep: number) => void;
  updateAmount: (e) => void;
}>('SendContext');

export function SendScreen() {
  const { createTransaction } = useAccount();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0.01);
  const [step, setStep] = useState(0);

  const cancel = () => navigate('/auth/overview');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await createTransaction({
        amt: currentAmount,
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

  const updateAmount = e => setCurrentAmount(e.target.valueAsNumber);

  const updateStep = (currentStep: number) => {
    setStep(currentStep);
  };

  return (
    <SendContext.Provider
      value={{
        status,
        currentAddress,
        currentAmount,
        updateCurrentAddress,
        updateAmount,
        updateStep,
      }}>
      <AppScreen
        title='Lähetä Rahaa'
        onClose={cancel}>
        <form
          className='flex flex-col w-full gap-2'
          onSubmit={handleSubmit}>
          <div className='flex w-full'>
            <TabButton selected={step === 0}>
              <Button
                type='button'
                onClick={() => setStep(0)}
                fullWidth
                variant='ghost'>
                Tietojen Täyttö
              </Button>
            </TabButton>

            <TabButton selected={step === 1}>
              <Button
                type='button'
                onClick={() => setStep(1)}
                fullWidth
                variant='ghost'>
                Skannaa QR-Koodi
              </Button>
            </TabButton>
          </div>
          {step === 0 ? (
            <ManualInputStep />
          ) : (
            <QRCodeReadStep
              onScan={data => {
                const [protocol, address, amount] = data.split(':');
                if (protocol !== 'mrk') {
                  return;
                }

                if (amount && amount !== 'null') {
                  setCurrentAmount(parseInt(amount) / 100);
                }

                setCurrentAddress(address);
                setStep(0);
              }}
            />
          )}
        </form>
      </AppScreen>
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
        <QrCode
          color='white'
          size='1rem'
        />{' '}
        Skannaa QR-koodi
      </Button>
      <Button
        type='button'
        fullWidth
        rounded
        shadow
        variant='outlined'
        onClick={() => updateStep(3)}>
        <AtSign
          color='var(--color-primary)'
          size='1rem'
        />
        Kirjoita osoite
      </Button>
    </div>
  );
}

function QRCodeReadStep({ onScan }: { onScan: (data) => void }) {
  const { updateStep } = useSendContext();

  return (
    <div className='flex flex-col w-full h-full flex-1 justify-center'>
      <QRScanner onScan={onScan} />
    </div>
  );
}

function EmailInput() {
  const { updateCurrentAddress, currentAddress } = useSendContext();
  return (
    <Input
      value={currentAddress}
      type='email'
      placeholder='Vastaanottajan sähköpostiosoite...'
      onChange={updateCurrentAddress}
      required
    />
  );
}

function AmountInput() {
  const { updateAmount, currentAmount } = useSendContext();
  const { account, isPending } = useAccount();
  const balance = isPending ? 0 : account.balance_in_cents;
  return (
    <Input
      value={currentAmount}
      onInput={updateAmount}
      name='amt'
      type='number'
      step={0.01}
      min={0.01}
      max={balance / 100}
      placeholder='Määrä...'
      required
    />
  );
}

function MessageInput() {
  return (
    <textarea
      className='w-full textarea'
      name='message'
      placeholder='Kirjoita viesti...'
      required
      spellCheck={'false'}
    />
  );
}

function ManualInputStep() {
  const { status, updateStep, currentAddress } = useSendContext();
  const loading = status === 'loading';

  return (
    <>
      <EmailInput />
      <AmountInput />
      <MessageInput />

      <ErrorMessages />
      <div className='flex w-full gap-2'>
        <LoaderButton
          loading={loading}
          disabled={!currentAddress?.length || loading}
          rounded
          type='submit'
          fullWidth>
          <Check
            color='white'
            size='1rem'
          />
          Lähetä
        </LoaderButton>
      </div>
    </>
  );
}

function ErrorMessages() {
  const { status } = useSendContext();

  return status === 'transaction:insufficient-funds' ? (
    <ErrorMessage>Saldosi ei riitä!</ErrorMessage>
  ) : status === 'transaction:invalid-recipient' ? (
    <ErrorMessage>Virheellinen vastaanottaja!</ErrorMessage>
  ) : status !== 'idle' && status !== 'loading' ? (
    <ErrorMessage>Jotakin meni pieleen!</ErrorMessage>
  ) : null;
}
