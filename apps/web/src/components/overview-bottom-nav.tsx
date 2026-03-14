import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';
import { useClassName } from '../hooks/use-class-name';
import { useLocation, useNavigate } from 'react-router-dom';

export function OverviewBottomNav() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  return (
    <div className='flex flex-row items-center justify-between gap-8 px-16 py-4 border-t border-slate-300 bg-white'>
      <NavButton
        onClick={() => navigate('/auth/overview')}
        icon={Wallet}
        selected={pathname === '/auth/overview'}
      />
      <NavButton
        onClick={() => navigate('/auth/send')}
        icon={ArrowUp}
        selected={pathname === '/auth/send'}
      />
      <NavButton
        onClick={() => navigate('/auth/receive')}
        icon={ArrowDown}
        selected={pathname === '/auth/receive'}
      />
    </div>
  );
}

function NavButton({ icon: Icon, onClick = null, selected = false }) {
  const containerClassname = useClassName(
    'rounded-full p-2 flex items-center justify-center transition-colors delay-50 cursor-pointer',
    selected ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-900',
  );
  return (
    <button
      className={containerClassname}
      onClick={onClick}>
      <Icon />
    </button>
  );
}
