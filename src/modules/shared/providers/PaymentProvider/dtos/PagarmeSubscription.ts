/* eslint-disable @typescript-eslint/ban-types */
import { PagarmeAddress } from './PagarmeAddress';
import { PagarmeCard } from './PagarmeCard';
import { PagarmeCustomer } from './PagarmeCustomer';
import { PagarmePhone } from './PagarmePhone';
import { PagarmePlan } from './PagarmePlan';
import { PagarmeTransaction } from './PagarmeTransaction';

/* eslint-disable camelcase */
export interface PagarmeSubscription {
  object: 'subscription';
  plan: PagarmePlan;
  id: number;
  current_transaction: PagarmeTransaction;
  postback_url?: string;
  payment_method: 'credit_card' | 'boleto';
  card_brand: string;
  card_last_digits: string;
  current_period_start: Date;
  current_period_end: Date;
  charges?: number;
  soft_descriptor?: string;
  status:
    | 'paid'
    | 'trialing'
    | 'pending_payment'
    | 'unpaid'
    | 'ended'
    | 'canceled';
  date_created: Date;
  date_updated: Date;
  phone: PagarmePhone;
  address: PagarmeAddress;
  customer: PagarmeCustomer;
  card: PagarmeCard;
  metadata?: object;
  manage_token: string;
  manage_url: string;
  settled_charges?: number[];
}
