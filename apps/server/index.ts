import express from 'express';
import { authRouter } from './src/features/auth/auth-router';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { transactionsRouter } from './src/features/transactions/transactions-router';
import { accountsRouter } from './src/features/accounts/accounts-router';
import { currenciesRouter } from './src/features/currencies/currencies-router';
import rateLimit from 'express-rate-limit';

const app = express();
const allowedOrigins = [
  'http://10.146.16.92:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:61032',
  'http://localhost:3000',
  'https://localhost',
  'capacitor://localhost',
  'https://cbdc-markka.onrender.com',
];
const limiter = rateLimit({
  limit: 100,
  windowMs: 1000 * 15 * 60,
});

app.use(limiter);
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin || true);
      } else {
        console.log('Disallowed origin', origin);
        return callback(new Error(`Origin ${origin} blocked by CORS!`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/currencies', currenciesRouter);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
