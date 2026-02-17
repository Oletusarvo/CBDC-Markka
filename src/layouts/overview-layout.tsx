import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { TransactionHistory } from '../components/transaction-history';
import { AccountProvider, useAccount } from '../providers/account-provider';
import { Spinner } from '../components/spinner';
import { LogOut } from 'lucide-react';
import { TransactionsProvider } from '../providers/transactions-provider';
import { useAnimatedNumber } from '../hooks/use-animated-number';
import { TokenProvider, useTokens } from '../providers/token-provider';
import { WalletDisplay } from '../components/wallet-display';
import { useState } from 'react';

export function OverviewLayout() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('tokens');

  return (
    <AccountProvider>
      <TokenProvider>
        <TransactionsProvider>
          <div className='flex flex-col w-full flex-1 max-h-full p-4 gap-4'>
            <div className='relative w-full'>
              <WalletContainer />
              <div className='absolute top-2 right-2'>
                <Button
                  circular
                  type='button'
                  variant='ghost'
                  onClick={() => navigate('/auth/logout')}>
                  <LogOut color='white' />
                </Button>
              </div>
            </div>
            <div className='w-full flex'>
              <Button
                onClick={() => setCurrentTab('transactions')}
                variant='ghost'
                fullWidth>
                Tapahtumat
              </Button>
              <Button
                onClick={() => setCurrentTab('wallet')}
                variant='ghost'
                fullWidth>
                Lompakko
              </Button>
            </div>
            {currentTab === 'transactions' ? <TransactionHistory /> : <WalletDisplay />}

            <div className='flex w-full gap-4'>
              <Button
                onClick={() => navigate('send')}
                fullWidth
                shadow
                rounded>
                Lähetä
              </Button>

              <Button
                onClick={() => navigate('receive')}
                fullWidth
                shadow
                variant='outlined'
                rounded>
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
  const { tokens, isPending } = useTokens();
  const currentBalance = useAnimatedNumber(
    tokens?.reduce((acc, cur) => (acc += parseInt(cur.value_in_cents as any)), 0) / 100 || 0,
  );
  return (
    <div className='rounded-xl shadow-md bg-linear-to-r from-primary to-green-400 p-8 w-full flex flex-col items-center'>
      <h3 className='text-white text-sm'>Tilin Saldo</h3>
      <h2 className='text-white font-semibold text-2xl font-mono'>
        {isPending ? <Spinner /> : Number(currentBalance).toFixed(2)} mk
      </h2>
    </div>
  );
}
