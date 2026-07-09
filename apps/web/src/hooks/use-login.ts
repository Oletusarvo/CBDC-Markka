import { useSession } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();
  const { signin } = useSession();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callback_url');
  const returnTo = searchParams.get('return_to');
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
    onSuccess: () => {
      const navigateUrl = callbackUrl || '/auth/overview';
      window.location.href = navigateUrl;
    },
  });
  return { submit, loading, status, returnTo };
}
