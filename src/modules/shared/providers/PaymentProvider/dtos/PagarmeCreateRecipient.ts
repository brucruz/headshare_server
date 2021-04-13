/* eslint-disable @typescript-eslint/ban-types */

import { PagarmeRegisterInformation } from './PagarmeRegisterInformation';
import { PagarmeCreateBankAccount } from './PagarmeCreateBankAccount';

/* eslint-disable camelcase */
export interface PagarmeCreateRecipient {
  transfer_interval: 'daily' | 'weekly' | 'monthly';
  transfer_day?: string;
  // Variável que indica se o recebedor pode receber os pagamentos automaticamente
  transfer_enabled?: boolean;
  bank_account?: PagarmeCreateBankAccount;
  register_information: PagarmeRegisterInformation;
  postback_url?: string;
  metadata?: object;
}
