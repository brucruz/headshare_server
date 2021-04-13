/* eslint-disable camelcase */
export interface PagarmeCustomer {
  object: 'customer';
  id: number;
  external_id: string;
  type: 'individual' | 'company';
  country: string;
  stringdocument_number?: string;
  document_type: 'cpf' | 'cnpj';
  name: string;
  email: string;
  phone_numbers: string[];
  born_at?: null;
  birthday?: null;
  gender?: null;
  date_created: Date;
  documents: string[];
}
