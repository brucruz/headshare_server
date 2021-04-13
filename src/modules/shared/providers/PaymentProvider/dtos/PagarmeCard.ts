import { PagarmeCustomer } from './PagarmeCustomer';

/* eslint-disable camelcase */
export interface PagarmeCard {
  object: 'card';
  id: string;
  date_created: Date;
  date_updated: Date;
  brand: string;
  holder_name: string;
  first_digits: string;
  last_digits: string;
  country: string;
  fingerprint: string;
  customer?: PagarmeCustomer;
  valid: boolean;
  expiration_date: string;
}
