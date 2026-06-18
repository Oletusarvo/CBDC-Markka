import { Link, useNavigate } from 'react-router-dom';
import { AppScreen } from '../components/app-screen';
import { Modal } from '../components/modal';

export function SettingsScreen() {
  const navigate = useNavigate();
  return (
    <Modal
      title='Asetukset'
      onClose={() => navigate(-1)}>
      <div className='flex items-center w-full'>
        <Link to='/reset-password'>Vaihda salasana</Link>
      </div>
    </Modal>
  );
}
