import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { TransactionHistory } from '../components/transaction-history';
import { Spinner } from '../components/spinner';
import { CircleArrowDown, CircleArrowUp, LogOut } from 'lucide-react';

import { useAnimatedNumber } from '../hooks/use-animated-number';

import { useState } from 'react';
import {
  AccountProvider,
  TokenProvider,
  TransactionsProvider,
  useAccount,
} from '@cbdc-markka/utils-react';
import { Currency } from '../components/currency';

export function OverviewLayout() {
  const navigate = useNavigate();

  return (
    <AccountProvider>
      <TokenProvider>
        <TransactionsProvider>
          <div className='flex flex-col w-full flex-1 bg-primary rounded-t-2xl max-h-full'>
            <div className='w-full bg-primary flex flex-col relative'>
              <div className='w-full flex items-center justify-end absolute p-2'>
                <Button
                  circular
                  type='button'
                  variant='ghost'
                  onClick={() => navigate('/auth/logout')}>
                  <LogOut color='white' />
                </Button>
              </div>
              <WalletContainer />
            </div>
            <div className='w-full flex flex-col flex-1 bg-slate-100 overflow-y-scroll p-4 gap-2 rounded-t-2xl max-h-full'>
              <TransactionHistory />
            </div>

            <div className='flex w-full gap-4 p-4 bg-slate-100'>
              <Button
                onClick={() => navigate('send')}
                fullWidth
                shadow
                rounded>
                <CircleArrowUp
                  size='1rem'
                  color='white'
                />
                Lähetä
              </Button>

              <Button
                onClick={() => navigate('receive')}
                fullWidth
                shadow
                variant='outlined'
                rounded>
                <CircleArrowDown
                  size='1rem'
                  className='text-primary'
                />
                Pyydä
              </Button>
            </div>
          </div>
          <Outlet />
        </TransactionsProvider>
      </TokenProvider>
    </AccountProvider>
  );
}

function WalletContainer() {
  const { account, isPending } = useAccount();
  const currentBalance = useAnimatedNumber(!isPending ? account.balance_in_cents / 100 : 0);
  return (
    <div className='px-8 py-16 w-full flex flex-col items-center'>
      <h3 className='text-white text-sm'>Tilin Saldo</h3>
      <h2 className='text-white font-semibold text-3xl font-mono'>
        ₥ {isPending ? <Spinner /> : Number(currentBalance).toFixed(2)}
      </h2>
    </div>
  );
}
