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
  signout: () => Promise<void>;
}>('AuthContext');

export function AuthProvider({ children }: React.PropsWithChildren) {
  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(withApi('auth/session'), {
        method: 'GET',
        credentials: 'include',
      });
      return res.status === 200 ? await res.json() : null;
    },
    enabled: false,
    retryDelay: 3000,
  });

  const [session, setSession] = useState(null);

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
      const res = await query.refetch();
      if (res.data) {
        setSession(res.data);
      }
    }
    return res;
  };

  const signout = async () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signin, signout }}>{children}</AuthContext.Provider>
  );
}

export { useSession };
