import { useApi } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useSearchParams } from 'react-router-dom';

export function useResetPassword() {
  const { apiInterface } = useApi();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { submit, status, loading } = useSubmit({
    fetchFn: async e => {
      const payload = Object.fromEntries(new FormData(e.currentTarget)) as {
        email?: string;
        password1?: string;
        password2?: string;
        token?: string;
      };
      console.log(payload);
      const res = await apiInterface.resetPassword({
        ...payload,
        token,
      });
      if (!res.ok) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    },
  });
  return { submit, status, loading, token };
}
