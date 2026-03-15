import { useNavigate } from 'react-router-dom';
import { Button, LoaderButton } from '../components/button';
import { Check, CurrencyIcon, Pencil, QrCode, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../components/input';

import { ErrorMessage } from '../components/helper-message';
import { setupContext, useAccount } from '@cbdc-markka/utils-react';
import QRScanner from '../components/qr-scanner';
import { AppScreen, DividedAppScreen } from '../components/app-screen';
import { TabButton } from '../components/tab-button';
import { appConfig } from '../util/app-config';
import { CurrencyAmountInput, CurrencySymbol } from '../components/currency';
import { Core } from '@cbdc-markka/core';
import { NavButton } from '../components/overview-bottom-nav';

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
  const [currentAmount, setCurrentAmount] = useState(1 / Core.COIN);

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
      <DividedAppScreen
        headerContent={
          <>
            <h2 className='text-white font-semibold text-xl'>Lähetä Rahaa</h2>
            <div className='flex items-center gap-2'>
              <NavButton
                variant='white'
                selected={step === 0}
                onClick={() => setStep(0)}
                icon={Pencil}></NavButton>
              <NavButton
                variant='white'
                selected={step === 1}
                onClick={() => setStep(1)}
                icon={QrCode}></NavButton>
            </div>
          </>
        }>
        <form
          className='flex flex-col w-full gap-2 p-4 flex-1 h-full'
          onSubmit={handleSubmit}>
          <div className='flex w-full flex-1 items-center justify-center flex-col gap-2 h-full'>
            {step === 0 ? (
              <ManualInputStep />
            ) : (
              <QRCodeReadStep
                onScan={data => {
                  const [protocol, address, amountInCents] = data.split(':');
                  if (protocol !== 'mrk') {
                    return;
                  }

                  if (amountInCents && amountInCents !== 'null') {
                    setCurrentAmount(Core.convertCurrencyAmount(amountInCents));
                  }

                  setCurrentAddress(address);
                  setStep(0);
                }}
              />
            )}
          </div>
        </form>
      </DividedAppScreen>
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
  const balance = Core.convertCurrencyAmount(account?.balance_in_cents || 1);
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
  const { account } = useAccount();
  const { status, updateStep, currentAddress, currentAmount } = useSendContext();
  const loading = status === 'loading';
  const convertedAmount = Core.convertCurrencyAmount(account?.balance_in_cents || 0);
  return (
    <>
      <div className='rounded-2xl shadow-lg bg-linear-to-br from-primary to-blue-600 w-full h-[170px] p-4 flex flex-col relative overflow-hidden'>
        <div className='bg-index z-0 grayscale absolute top-0 left-0 opacity-30 w-full h-full bg-cover bg-center' />
        <div className='flex flex-col text-white gap-1 z-10'>
          <span className='text-xs text-white'>{account?.id}</span>
          <span className='text-2xl'>
            {Core.amountToString(convertedAmount)} <span className='text-lg'>mk</span>
          </span>
        </div>

        <div className='flex justify-end mt-auto w-full'>
          <div className='flex relative'>
            <div className='rounded-full bg-purple-300/50 w-8 aspect-square' />
            <div className='rounded-full bg-white/50 w-8 aspect-square -translate-x-4' />
          </div>
        </div>
      </div>
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
