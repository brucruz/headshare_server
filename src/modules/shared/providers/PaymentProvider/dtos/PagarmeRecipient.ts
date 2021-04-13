/* eslint-disable @typescript-eslint/ban-types */
import { PagarmeBankAccount } from './PagarmeBankAccount';

/* eslint-disable camelcase */
export interface PagarmeRecipient {
  object: 'recipient';
  id: string;
  transfer_enabled: false;
  last_transfer?: Date;
  transfer_interval?: 'daily' | 'weekly' | 'monthly';
  transfer_day?: number;
  automatic_anticipation_enabled: boolean;
  automatic_anticipation_type: string;
  automatic_anticipation_days?: string;
  date_created: Date;
  date_updated: Date;
  bank_account: PagarmeBankAccount;
  status:
    | 'registration'
    | 'affiliation'
    | 'active'
    | 'refused'
    | 'suspended'
    | 'blocked'
    | 'inactive';
  status_reason?: string;
  metadata?: object;
}
