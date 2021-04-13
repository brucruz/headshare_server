/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable camelcase */
export interface PagarmeCreateCard {
  // Número do cartão
  card_number: string;
  // Data de expiração do cartão
  card_expiration_date: string;
  // Nome no cartão do portador
  card_holder_name: string;
  // Código de segurança do cartão
  card_cvv?: string;
  // Informações do cliente do card a ser gerado
  customer_id?: number;
}
