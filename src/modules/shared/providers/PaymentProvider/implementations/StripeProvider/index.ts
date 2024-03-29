import { Stripe } from 'stripe';

const key = process.env.STRIPE_RESTRICTED_KEY || '';

export const stripe = new Stripe(key, {
  apiVersion: '2020-08-27',
  typescript: true,
  maxNetworkRetries: 3,
  appInfo: {
    name: 'Headshare',
  },
});
