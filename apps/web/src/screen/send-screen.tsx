import { useNavigate } from 'react-router-dom';
import { Button, LoaderButton } from '../components/button';
import { Check, CurrencyIcon, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../components/input';

import { ErrorMessage } from '../components/helper-message';
import { setupContext, useAccount } from '@cbdc-markka/utils-react';
import QRScanner from '../components/qr-scanner';
import { AppScreen } from '../components/app-screen';
import { TabButton } from '../components/tab-button';
import { appConfig } from '../util/app-config';
import { CurrencyAmountInput, CurrencySymbol } from '../components/currency';

const [SendContext, useSendContext] = setupContext<{
  status: string;
  currentAddress: string;
  currentAmount: number;
  updateCurrentAddress: (e) => void;
  updateStep: (currentStep: number) => void;
  updateAmount: (e) => void;
}>('SendContext');

export function SendScreen() {
  const { createTransaction, account } = useAccount();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0.01);

  const [step, setStep] = useState(0);

  const cancel = () => navigate('/auth/overview');

  const handleSubmit = async (e: any) => {
    if (!account) return;
    e.preventDefault();
    setStatus('loading');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await createTransaction({
        amt: currentAmount,
        recipient_id: currentAddress,
        nonce: account.nonce,
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
          className='flex flex-col w-full gap-2 px-4 flex-1 h-full'
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
          <div className='flex w-full flex-1 items-center flex-col gap-2'>
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
          </div>
        </form>
      </AppScreen>
    </SendContext.Provider>
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
      fullWidth
      iconComponent={User}
      value={currentAddress}
      placeholder='Vastaanottajan tunnus...'
      onChange={updateCurrentAddress}
      required
    />
  );
}

function AmountInput() {
  const { updateAmount, currentAmount } = useSendContext();
  const { account } = useAccount();
  const balance = account ? account.balance_in_cents / 100 : 0.01;
  return (
    <CurrencyAmountInput
      value={currentAmount}
      onInput={updateAmount}
      max={balance}
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

  return status === 'transaction:funds-insufficient' ? (
    <ErrorMessage>Saldosi ei riitä!</ErrorMessage>
  ) : status === 'transaction:recipient-invalid' ? (
    <ErrorMessage>Virheellinen vastaanottaja!</ErrorMessage>
  ) : status === 'transaction:self-transaction' ? (
    <ErrorMessage>Samalle tilille ei voi lähettää!</ErrorMessage>
  ) : status === 'transaction:signature-invalid' ? (
    <ErrorMessage>Jomman kumman osapuolen tilin digitaalinen allekirjoitus ei täsmää!</ErrorMessage>
  ) : status === 'transaction:sequence-invalid' ? (
    <ErrorMessage>Tilisiirron järjestysvirhe! Ole hyvä ja yritä uudelleen.</ErrorMessage>
  ) : status !== 'idle' && status !== 'loading' ? (
    <ErrorMessage>Jotakin meni pieleen!</ErrorMessage>
  ) : null;
}
