import { ApiInterface } from '@cbdc-markka/utils-api';
import { setupContext } from '../util/setup-context';

const [ApiContext, useApi] = setupContext<{
  apiInterface: ApiInterface;
}>('ApiContext');

type ApiProviderProps = React.PropsWithChildren & {
  apiInterface: ApiInterface;
};

export function ApiProvider({ children, apiInterface }: ApiProviderProps) {
  return <ApiContext.Provider value={{ apiInterface }}>{children}</ApiContext.Provider>;
}

export { useApi };
