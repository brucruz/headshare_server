/* eslint-disable camelcase */
export interface PagarmeUpdatePlan {
  id: number;
  // Nome do plano
  name?: string;
  // default: 0 Dias para teste gratuito do produto. Valor começará a ser cobrado no dia trial_days + 1
  trial_days?: number;
  // Define em até quantos dias antes o cliente será avisado sobre o vencimento do boleto.
  invoice_reminder?: number;
}
