import { useParams } from 'react-router-dom';
import { AppScreen } from '../components/app-screen';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Box } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useApi } from '@cbdc-markka/utils-react';
import { Spinner } from '../components/spinner';
import { Core } from '@cbdc-markka/core';
import { AppIcon } from '../components/app-icon';

export function PaymentSessionScreen() {
  const { id } = useParams();
  const { account, isPending: accountIsPending } = useAccount();
  const { apiInterface } = useApi();
  const { data: paymentSession, isLoading } = useQuery({
    queryKey: ['payment-session', id],
    queryFn: async () => {
      const res = await apiInterface.getPaymentSession(id);
      return res.ok ? await res.json() : null;
    },
  });

  if (isLoading || accountIsPending) return <Spinner />;
  //if (!paymentSession) return <div>Maksuistuntoa ei ole.</div>;

  const balance = Core.convertCurrencyAmount(account.balance_in_cents);
  return (
    <AppScreen headerShown={false}>
      <div className='flex flex-col items-center justify-center w-full flex-1 gap-4 bg-white px-2'>
        <div className='flex flex-col gap-2 w-full p-4 rounded-md'>
          <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-center w-full mb-4 gap-2 flex-col items-center'>
              <AppIcon />
              <h2 className='font-semibold text-slate-500'>e-MRK</h2>
            </div>

            <h3 className='font-semibold'>Maksusuoritus</h3>
            <table className='w-full text-slate-500'>
              <tbody>
                <tr>
                  <td className='font-semibold'>Tilin saldo</td>
                  <td className='text-right'>{balance}mk</td>
                </tr>
                <tr className='bg-slate-100'>
                  <td className='font-semibold'>Vastaanottaja</td>
                  <td className='text-right'>{paymentSession?.to || 'Ei määritelty'}</td>
                </tr>
                <tr>
                  <td className='font-semibold'>Määrä</td>
                  <td className='text-right'>
                    {paymentSession?.amount_in_cents / Core.COIN || 'Ei määritelty'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='flex items-center gap-2 w-full'>
            <Button
              type='button'
              fullWidth
              rounded
              variant='outlined'>
              Hylkää
            </Button>
            <Button
              type='button'
              fullWidth
              rounded>
              Hyväksy
            </Button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}
