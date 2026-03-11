import { ApiInterface } from '@cbdc-markka/utils-api';

const MODE = import.meta.env.MODE;
export const apiInterface = new ApiInterface(
  MODE === 'production'
    ? 'https://cbdc-markka-server.onrender.com/api'
    : 'http://localhost:3001/api',
);
