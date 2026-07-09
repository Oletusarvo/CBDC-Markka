import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/modal';
import { Button, LoaderButton } from '../components/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { ErrorMessage } from '../components/helper-message';
import { useLogout } from '../hooks/use-logout';
import { useSession } from '@cbdc-markka/utils-react';
import { lang } from '../util/lang';
import { useAppContext } from '../providers/app-provider';

export function LogoutScreen() {
  const navigate = useNavigate();
  const { session } = useSession();
  const { handleSignout, status, pending } = useLogout();
  const { selectedLanguage } = useAppContext();

  return (
    <Modal
      title={lang.logout[selectedLanguage]}
      onClose={() => navigate('/auth/overview')}>
      <div className='flex flex-col gap-2 w-full'>
        <p className='text-slate-500'>
          {selectedLanguage === 'fi'
            ? 'Haluatko varmasti kirjautua ulos?'
            : 'Are you sure you wish to log out?'}
        </p>
        {status === 'error' ? (
          <ErrorMessage>
            {selectedLanguage === 'fi' ? 'Uloskirjautuminen epäonnistui!' : 'Logout failed!'}
          </ErrorMessage>
        ) : null}
        <div className='flex items-center gap-2 w-full'>
          <Button
            onClick={() => navigate('/auth/overview')}
            fullWidth
            rounded
            variant='outlined'
            type='button'>
            <ArrowLeft
              color='var(--color-primary)'
              size='1rem'
            />
            {lang.cancel[selectedLanguage]}
          </Button>
          <LoaderButton
            disabled={pending || status === 'success'}
            loading={pending}
            onClick={handleSignout}
            fullWidth
            rounded
            shadow
            variant='contained'
            type='button'>
            <LogOut
              color='white'
              size='1rem'
            />
            {lang.yes[selectedLanguage]}
          </LoaderButton>
        </div>
      </div>
    </Modal>
  );
}
