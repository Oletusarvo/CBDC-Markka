import { useSession } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();
  const { signin } = useSession();
  const { submit, loading, status } = useSubmit({
    fetchFn: async e => {
      const credentials = Object.fromEntries(new FormData(e.currentTarget));
      const res = await signin(credentials);

      if (res.ok) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: await res.text(),
        };
      }
    },
    onSuccess: () => navigate('/auth/overview'),
  });
  return { submit, loading, status };
}
