import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeTransaction } from '../../dtos/PagarmeTransaction';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function subscriptionsTransactionsPagarme(
  subscriptionId: number,
): Promise<PagarmeTransaction[] | PagarmeError[]> {
  const client = await connectToPagarMe();

  let transactions: PagarmeTransaction[];

  try {
    transactions = await client.subscriptions.findTransactions({
      id: subscriptionId,
    });

    return transactions;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
