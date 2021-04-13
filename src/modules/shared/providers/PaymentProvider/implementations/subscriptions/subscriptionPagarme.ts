import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeSubscription } from '../../dtos/PagarmeSubscription';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function subscriptionPagarme(
  id: number,
): Promise<PagarmeSubscription | PagarmeError[]> {
  const client = await connectToPagarMe();

  let subscription: PagarmeSubscription;

  try {
    subscription = await client.subscriptions.find({ id }, '');

    return subscription;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
