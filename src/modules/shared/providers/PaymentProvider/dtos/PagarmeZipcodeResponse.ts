/* eslint-disable @typescript-eslint/ban-types */
import { PagarmeBankAccount } from './PagarmeBankAccount';

/* eslint-disable camelcase */
export interface PagarmeTransfer {
  object: 'transfer';
  id: number;
  amount: number;
  status:
    | 'pending_transfer'
    | 'transferred'
    | 'failed'
    | 'processing'
    | 'canceled';
  fee: number;
  funding_date?: number;
  funding_estimated_date: Date;
  transaction_id?: number;
  bank_account: PagarmeBankAccount;
  date_created: Date;
  metadata: object;
}
