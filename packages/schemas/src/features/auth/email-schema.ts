import z from 'zod';

const allowedDomains = ['gmail.com', 'hotmail.com'];

export const emailSchema = z.email().refine(
  email => {
    const domain = email.split('@').at(1);
    return allowedDomains.includes(domain);
  },
  {
    error: 'auth:unsupported-domain',
  },
);
