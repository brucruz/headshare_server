/* eslint-disable @typescript-eslint/ban-types */

import { PagarmeCreateCustomer } from './PagarmeCreateCustomer';
import { PagarmeSplitRule } from './PagarmeSplitRules';

/* eslint-disable camelcase */
export interface PagarmeCreateSubscription {
  plan_id: number;
  payment_method?: 'boleto' | 'credit_card';
  card_id: string;
  // Descrição que aparecerá na fatura depois do nome de sua empresa. Máximo de 13 caracteres, sendo alfanuméricos e espaços
  soft_descriptor?: string;
  // URL para a qual nossa API irá enviar requisições informando alterações de status da assinatura em questão
  postback_url?: string;
  customer?: PagarmeCreateCustomer;
  // Você pode passar dados adicionais na criação da transação para facilitar uma futura análise de dados tanto em nossa dashboard, quanto por seus sistemas. Ex: metadata[ idProduto ]=13933139
  metadata?: object;
  // Valor único que identifica a transação para permitir uma nova tentativa de requisição com a segurança de que a mesma operação não será executada duas vezes acidentalmente. OBS: Não pode ser igual a um valor já usado em uma criação de transação
  reference_key?: string;
  split_rules?: PagarmeSplitRule[];
}
