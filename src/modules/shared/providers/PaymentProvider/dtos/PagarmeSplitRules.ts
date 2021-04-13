/* eslint-disable camelcase */
export type PagarmeSplitRule =
  | ({
      recipient_id: string;
      liable?: boolean;
      charge_processing_fee?: boolean;
      charge_remainder?: boolean;
    } & {
      amount: number;
    })
  | {
      percentage: number;
    };
