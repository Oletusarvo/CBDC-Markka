import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { TransactionHistory } from '../components/transaction-history';
import { AccountProvider, useAccount } from '../providers/account-provider';
import { Spinner } from '../components/spinner';
import { LogOut } from 'lucide-react';
import { TransactionsProvider } from '../providers/transactions-provider';

export function OverviewLayout() {
  const navigate = useNavigate();
  return (
    <AccountProvider>
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

          <TransactionHistory />
          <div className='flex w-full gap-4 items-center'>
            <Link
              to={'send'}
              className='w-full h-full'>
              <Button
                fullWidth
                shadow
                rounded>
                Lähetä
              </Button>
            </Link>
            <Link
              to='receive'
              className='w-full'>
              <Button
                fullWidth
                shadow
                variant='outlined'
                rounded>
                Pyydä
              </Button>
            </Link>
          </div>
        </div>
        <Outlet />
      </TransactionsProvider>
    </AccountProvider>
  );
}

function WalletContainer() {
  const { account, isPending } = useAccount();
  return (
    <div className='rounded-xl shadow-md bg-linear-to-r from-primary to-green-400 p-8 w-full flex flex-col items-center'>
      <h3 className='text-white text-sm'>Tilin Saldo</h3>
      <h2 className='text-white font-semibold text-2xl font-mono'>
        {isPending ? <Spinner /> : Number(account.balance_in_cents / 100).toFixed(2)} mk
      </h2>
    </div>
  );
}
