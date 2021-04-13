/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */
export interface PagarmeTransaction {
  object: 'transaction';
  status: string; // 'paid'
  refuse_reason?: string;
  status_reason: string;
  acquirer_response_code: string;
  acquirer_name: string;
  acquirer_id: string;
  authorization_code: string;
  soft_descriptor?: string;
  tid: string;
  nsu: string;
  date_created: Date;
  date_updated: Date;
  amount: number;
  authorized_amount: number;
  paid_amount: number;
  refunded_amount: number;
  installments: number;
  id: number;
  cost: number;
  card_holder_name: string;
  card_last_digits: string;
  card_first_digits: string;
  card_brand: string;
  payment_method: 'credit_card' | 'boleto';
  subscription_id?: number;
  metadata?: object;
  risk_level?: string;
}
