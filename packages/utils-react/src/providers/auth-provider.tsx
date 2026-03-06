import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { setupContext } from '../util/setup-context';
import { useApi } from './api-provider';

const [AuthContext, useSession] = setupContext<{
  session: {
    user: {
      id: string;
      email: string;
    };
  };
  signin: (credentials: any) => Promise<Response>;
  signout: () => Promise<Response>;
  status: 'authenticated' | 'unauthenticated' | 'loading';
}>('AuthContext');

const sessionName = 'cbdc-markka-session';
function AuthProvider({ children }: React.PropsWithChildren) {
  const { apiInterface } = useApi();
  const {
    data: session,
    isPending: sessionPending,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(apiInterface.withApi('auth/session'), {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 200) {
        const data = await res.json();

        return data;
      }
      return null;
    },
    retryDelay: 3000,
  });

  const status = session ? 'authenticated' : sessionPending ? 'loading' : 'unauthenticated';

  const signin = async (credentials: any) => {
    const res = await fetch(apiInterface.withApi('auth/login'), {
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
    const res = await fetch(apiInterface.withApi('auth/logout'), {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 200) {
      await refetch();
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ session, signin, signout, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useSession };
