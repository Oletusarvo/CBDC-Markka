import { useAccount } from '@cbdc-markka/utils-react';
import { CurrencySymbol } from '../components/currency';
import { Spinner } from '../components/spinner';
import { TransactionHistory } from '../components/transaction-history';
import { useAnimatedNumber } from '../hooks/use-animated-number';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { LogOut, Settings } from 'lucide-react';
import { AppScreen, DividedAppScreen } from '../components/app-screen';
import { Core } from '@cbdc-markka/core';

export function OverviewScreen() {
  const navigate = useNavigate();

  return (
    <DividedAppScreen
      headerContent={
        <>
          <WalletContainer />
          <div className='flex items-center gap-2'>
            <Button
              compact
              circular
              type='button'
              variant='ghost'
              onClick={() => navigate('/auth/logout')}>
              <LogOut color='white' />
            </Button>
          </div>
        </>
      }>
      <TransactionHistory />
    </DividedAppScreen>
  );
}

function WalletContainer() {
  const { account, isPending } = useAccount();
  const convertedBalance = Core.convertCurrencyAmount(account?.balance_in_cents || 0);
  //const currentBalance = useAnimatedNumber(convertedBalance);

  return (
    <div className='flex flex-col'>
      <h3 className='text-white text-sm'>Tilin Saldo</h3>
      <h2 className='text-white text-3xl font-mono flex gap-1 items-baseline'>
        <CurrencySymbol
          strokeWidth={0.9}
          size='1.2rem'
        />
        {isPending ? <Spinner /> : Core.amountToString(convertedBalance)}
      </h2>
    </div>
  );
}
