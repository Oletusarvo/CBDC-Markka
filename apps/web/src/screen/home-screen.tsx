import { LogIn, User, UserPlus } from "lucide-react";
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import { CurrencySymbol } from "../components/currency";
import { useAnimatedNumber } from "../hooks/use-animated-number";
import { Spinner } from "../components/spinner";
import { useApi, useSession } from "@cbdc-markka/utils-react";
import { useQuery } from "@tanstack/react-query";
import { Core } from "@cbdc-markka/core";
import { WarningMessage } from "../components/helper-message";

export function HomeScreen() {
  const navigate = useNavigate();
  const { status } = useSession();

  return (
    <main className='flex flex-col flex-1 antialiased overflow-y-scroll'>
      <section className='w-full h-pad py-32 flex items-center relative flex-1 '>
        <div className='flex flex-col items-center w-full z-20 gap-4'>
          <div className='w-full flex flex-col items-center gap-2'>
            <img src='/app-icon.svg' className='w-24 h-24 rounded-lg shadow-md shadow-cyan-500' />
            <h1 className='text-4xl font-semibold text-primary'>e-MRK</h1>
            <p className='text-center text-primary font-semibold'>
              A digital currency inspired by the finnish mark.
            </p>
            <WarningMessage>The e-MRK is not legal tender!</WarningMessage>
          </div>

          <div className='grid xs:grid-cols-1 sm:grid-cols-2 gap-2'>
            {status === "unauthenticated" ? (
              <>
                <Button
                  color='primary-pretty'
                  onClick={() => navigate("/register")}
                  fullWidth
                  type='button'
                  rounded
                  shadow
                >
                  <UserPlus color='white' size='1rem' />
                  <span className='text-nowrap'>Create Account</span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  fullWidth
                  type='button'
                  variant='outlined'
                  rounded
                >
                  <LogIn color='var(--color-primary)' size='1rem' />
                  Log In
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth/overview")}
                color='primary-pretty'
                fullWidth
                type='button'
                variant='contained'
                rounded
                shadow
              >
                <User color='white' size='1rem' /> Show your account
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className='w-full py-16 bg-gray-900 text-white h-pad flex flex-col items-start gap-2'>
        <h2 className='font-semibold text-xl'>What is the e-MRK?</h2>

        <p className='text-gray-200 mb-4'>
          The e-MRK is a mock virtual currency inspired by the finnish markka. The e-MRK is not
          legal tender, and should not be used as such.
        </p>
        <h3 className='text-lg font-semibold'>Features</h3>
        <div className='xs:grid-cols-1 md:grid-cols-2 grid w-full gap-2'>
          <div className='rounded-md border border-white/20 bg-white/10 p-4 flex flex-col'>
            <h4 className='font-semibold'>Circulation Hard Cap</h4>
            <p>The currency has a hard-cap that will not ever be exceeded, to prevent inflation.</p>
          </div>
          <div className='rounded-md border border-white/20 bg-white/10 p-4 flex flex-col'>
            <h4 className='font-semibold'>Starting Balance</h4>
            <p>
              Each account is given 20mk as a starting balance, until the maximum circulating supply
              is reached.
            </p>
          </div>
          <div className='rounded-md border border-white/20 bg-white/10 p-4 flex flex-col'>
            <h4 className='font-semibold'>Transaction History</h4>
            <p>Your transactions are retained for 90 days.</p>
          </div>
          <div className='rounded-md border border-white/20 bg-white/10 p-4 flex flex-col'>
            <h4 className='font-semibold'>Easy transactions</h4>
            <p>
              Transact money to other users by using their account id, or send or receive money
              using a qr-code.
            </p>
          </div>
        </div>
      </section>

      <footer className='flex w-full py-16 h-pad bg-gray-900 text-white flex-col'>
        <div className='flex flex-col items-center'>
          <span className='text-sm'>Database hosting powered by</span>
          <Link
            to='https://neon.com/signup?refcode=K2RWLMYK'
            className='text-white font-semibold'
            target='_blank'
          >
            Neon Postgres
          </Link>
        </div>
      </footer>
    </main>
  );
}

function CirculationDisplay() {
  const { apiInterface } = useApi();
  const { data, isPending } = useQuery({
    queryKey: ["circulation"],
    queryFn: async () => {
      const res = await fetch(apiInterface.withApi("currencies/circulation"), {
        method: "GET",
      });
      return res.status === 200 ? await res.json() : null;
    },
    refetchInterval: 30000,
  });

  const currentCirculation = useAnimatedNumber(!isPending ? data.circulation / Core.COIN : 0);

  return (
    <div className='flex flex-col w-full items-center mb-4'>
      <span className='text-sm'>Circulating Supply</span>
      <div className='font-mono text-lg flex items-center'>
        <CurrencySymbol size='1rem' />
        {isPending ? <Spinner /> : Core.amountToString(currentCirculation)}
      </div>
    </div>
  );
}
