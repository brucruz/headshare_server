/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */
export interface PagarmeCreateTransfer {
  amount: number;
  recipient_id: string;
  metadata?: object;
}
