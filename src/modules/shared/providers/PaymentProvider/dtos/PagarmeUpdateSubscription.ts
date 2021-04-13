/* eslint-disable camelcase */
export interface PagarmeUpdateSubscription {
  // subscription_id: number;
  id: number;
  plan_id?: number;
  payment_method?: 'boleto' | 'credit_card';
  card_id?: string;
}
