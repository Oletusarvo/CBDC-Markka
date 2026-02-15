import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { Send, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../components/input';
import { withApi } from '../util/server-config';
import { useAccount } from '../providers/account-provider';

export function SendScreen() {
  const { account } = useAccount();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const loading = status === 'loading';
  const [currentAddress, setCurrentAddress] = useState('');

  const cancel = () => navigate('/auth/overview');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch(withApi('transactions'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        setStatus('success');
        cancel();
      } else if (res.status !== 500) {
        const err = await res.json();
        setStatus(err.error);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <Modal
      title='Lähetä Rahaa'
      onClose={cancel}>
      <form
        className='flex flex-col w-full gap-2'
        onSubmit={handleSubmit}>
        <div className='flex flex-col w-full'>
          <Input
            name='email'
            type='email'
            placeholder='Vastaanottajan sähköpostiosoite...'
            onChange={e => setCurrentAddress(e.target.value)}
          />
          {status === 'transaction:invalid-recipient' ? (
            <span className='text-sm text-red-600'>Vastaanottajaa ei ole!</span>
          ) : null}
        </div>
        <div className='flex flex-col w-full'>
          <Input
            name='amt'
            type='number'
            step={0.01}
            min={0.01}
            max={account.balance_in_cents / 100}
            placeholder='Määrä...'
          />

          {status === 'transaction:insufficient-funds' ? (
            <span className='text-sm text-red-600'>Saldosi ei riitä!</span>
          ) : null}
        </div>

        <textarea
          className='w-full textarea'
          name='message'
          placeholder='Kirjoita viesti...'
          required
        />
        <div className='flex gap-2 w-full'>
          <Button
            rounded
            fullWidth
            variant='outlined'
            type='button'
            onClick={cancel}>
            Peruuta
          </Button>
          <LoaderButton
            loading={loading}
            fullWidth
            rounded
            disabled={currentAddress.length == 0 || loading}>
            Lähetä
          </LoaderButton>
        </div>
      </form>
    </Modal>
  );
}
