import { PagarmeAddress } from './PagarmeAddress';
import { PagarmePhone } from './PagarmePhone';

/* eslint-disable camelcase */
export interface PagarmeCreateCustomer {
  email: string;
  name: string;
  document_number: string;
  document_type: 'cpf' | 'cnpj';
  address: PagarmeAddress;
  phone: PagarmePhone;
  gender?: string;
  // Data de nascimento do cliente. Ex: 11-02-1985
  born_at?: Date;
}
