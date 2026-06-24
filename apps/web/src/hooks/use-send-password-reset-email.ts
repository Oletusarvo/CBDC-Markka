import { useApi } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';

export function useSendPasswordResetEmail() {
  const { apiInterface } = useApi();
  const { submit, status, loading } = useSubmit({
    fetchFn: async e => {
      const payload = Object.fromEntries(new FormData(e.currentTarget)) as { email: string };
      const res = await apiInterface.forgotPassword(payload);
      if (!res.ok) {
        return {
          success: false,
        };
      } else {
        return {
          success: true,
        };
      }
    },
  });

  return { submit, status, loading };
}
