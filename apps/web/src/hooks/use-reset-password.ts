import { useApi } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useResetPassword() {
  const navigate = useNavigate();
  const { apiInterface } = useApi();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { submit, status, loading } = useSubmit({
    fetchFn: async e => {
      const payload = Object.fromEntries(new FormData(e.currentTarget)) as {
        password: string;
        password2: string;
      };

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
    onSuccess: () => navigate('/login'),
  });
  return { submit, status, loading };
}
