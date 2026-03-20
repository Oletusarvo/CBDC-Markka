import { useApi } from '@cbdc-markka/utils-react';
import { useSubmit } from './use-submit';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useRegisterStepOne() {
  const { apiInterface } = useApi();
  const { status, submit, loading } = useSubmit({
    fetchFn: async e => {
      const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
        email: string;
      };
      const res = await apiInterface.registerUser(credentials);
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
  });

  return { status, submit, loading };
}

export function useRegisterStepTwo() {
  const { apiInterface } = useApi();
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const { status, loading, submit } = useSubmit({
    fetchFn: async e => {
      const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
        password1: string;
        password2: string;
      };
      const res = await apiInterface.registerUser({
        ...credentials,
        token,
      });
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
      navigate('/login');
    },
  });

  return { status, loading, submit };
}
