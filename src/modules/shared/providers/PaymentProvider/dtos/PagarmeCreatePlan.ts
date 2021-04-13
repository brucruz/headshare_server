/* eslint-disable camelcase */
export interface PagarmeCreatePlan {
  // Valor que será cobrado recorrentemente (em centavos). Ex: R$49,90 = 4990
  amount: number;
  // Prazo, em dias, para cobrança das parcelas
  days: number;
  // Nome do plano
  name: string;
  // default: 0 Dias para teste gratuito do produto. Valor começará a ser cobrado no dia trial_days + 1
  trial_days?: number;
  // Meios de pagamentos aceitos. Pode ser "boleto", "credit_card" ou ambos
  payment_methods?: ('boleto' | 'credit_card')[];
  // Armazena o valor de uma cor para o plano
  color?: string;
  // Número de cobranças que poderão ser feitas nesse plano. Ex: Plano cobrado 1x por ano, válido por no máximo 3 anos. Nesse caso, nossos parâmetros serão: days = 365, installments = 1, charges=2 (cartão de crédito) ou charges=3 (boleto). OBS: No caso de cartão de crédito, a cobrança feita na ativação da assinatura não é considerada. OBS: null irá cobrar o usuário indefinidamente, ou até o plano ser cancelado
  charges?: number;
  // Número de parcelas entre cada cobrança (charges). Ex: Plano anual, válido por 2 anos, sendo que cada transação será dividida em 12 vezes. Nesse caso, nossos parâmetros serão: days = 365, installments = 12, charges=2 (cartão de crédito) ou charges=3 (boleto). OBS: Boleto sempre terá installments = 1
  installments?: number;
  // Define em até quantos dias antes o cliente será avisado sobre o vencimento do boleto.
  invoice_reminder?: number;
}
