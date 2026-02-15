import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/button';
import { TransactionHistory } from '../components/transaction-history';
import { AccountProvider, useAccount } from '../providers/account-provider';
import { Spinner } from '../components/spinner';

export function OverviewLayout() {
  return (
    <AccountProvider>
      <div className='flex flex-col w-full flex-1 max-h-full p-4 gap-4'>
        <WalletContainer />
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
        <Outlet />
      </div>
    </AccountProvider>
  );
}

function WalletContainer() {
  const { account, isPending } = useAccount();
  return (
    <div className='rounded-xl shadow-lg bg-linear-to-r from-fuchsia-500 to-purple-500 p-8 w-full flex flex-col items-center'>
      <h3 className='text-white text-sm'>Tilin Saldo</h3>
      <h2 className='text-white font-semibold text-2xl'>
        {isPending ? <Spinner /> : Number(account.balance_in_cents / 100).toLocaleString('en')} mk
      </h2>
    </div>
  );
}
