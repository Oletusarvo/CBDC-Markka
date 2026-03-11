import dotenv from 'dotenv';

export const MODE = process.env.MODE;

dotenv.config({
  path: MODE ? `.env.${MODE}` : '.env',
});
