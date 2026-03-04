import { ApiInterface } from '@cbdc-markka/utils-api';

export const apiInterface = new ApiInterface(
  import.meta.env.PROD
    ? 'https://cbdc-markka-server.onrender.com/api'
    : 'http://localhost:3000/api',
);
