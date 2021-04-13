/* eslint-disable camelcase */
export interface PagarmeBankAccount {
  object: 'bank_account';
  id: number;
  bank_code: string;
  agencia: string;
  agencia_dv?: string;
  conta: string;
  conta_dv: string;
  type:
    | 'conta_corrente'
    | 'conta_poupanca'
    | 'conta_corrente_conjunta'
    | 'conta_poupanca_conjunta';
  document_type: 'cnpj' | 'cpf';
  document_number: string;
  legal_name: string;
  charge_transfer_fees?: boolean;
  date_created: Date;
}
