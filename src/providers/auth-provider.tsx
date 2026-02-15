import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { setupContext } from '../util/setup-context';
import { withApi } from '../util/server-config';
import { useState } from 'react';

const [AuthContext, useSession] = setupContext<{
  session: {
    user: {
      id: string;
      email: string;
    };
  };
  signin: (credentials: any) => Promise<Response>;
  signout: () => Promise<Response>;
}>('AuthContext');

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { data: session, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(withApi('auth/session'), {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem('cbdc-markka-session', JSON.stringify(data));
        return data;
      }
      return null;
    },
    retryDelay: 3000,
  });

  const signin = async (credentials: any) => {
    const res = await fetch(withApi('auth/login'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      await refetch();
    }

    return res;
  };

  const signout = async () => {
    const res = await fetch(withApi('auth/logout'), {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 200) {
      localStorage.removeItem('cbdc-markka-session');
      await refetch();
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ session, signin, signout }}>{children}</AuthContext.Provider>
  );
}

export { useSession };
