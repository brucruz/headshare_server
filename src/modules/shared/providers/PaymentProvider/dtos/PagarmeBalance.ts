/* eslint-disable @typescript-eslint/ban-types */

/* eslint-disable camelcase */
export interface PagarmeBalance {
  object: 'balance';
  waiting_funds: {
    amount: number;
  };
  available: {
    amount: number;
  };
  transferred: {
    amount: number;
  };
}
