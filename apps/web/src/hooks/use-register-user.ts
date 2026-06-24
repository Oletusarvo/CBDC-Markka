import { useApi } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useRegisterUser() {
  const { apiInterface } = useApi();
  const { status, submit, loading } = useSubmit({
    fetchFn: async e => {
      const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
        email: string;
        password: string;
        password2: string;
      };
      if (credentials.password !== credentials.password2) {
        return {
          success: false,
          error: JSON.stringify({
            error: 'auth:password-mismatch',
          }),
        };
      }

      const res = await apiInterface.registerUser(credentials);
      if (res.ok) {
        return {
          success: true,
        };
      } else {
        const err = res.status !== 500 ? await res.json() : null;
        const error = err ? err.properties?.email?.errors.at(0) || err.error : null;

        return {
          success: false,
          error: JSON.stringify({
            error,
          }),
        };
      }
    },
  });

  return { status, submit, loading };
}
