import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeSubscription } from '../../dtos/PagarmeSubscription';
import { PagarmeUpdateSubscription } from '../../dtos/PagarmeUpdateSubscription';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function updateSubscriptionPagarme(
  data: PagarmeUpdateSubscription,
): Promise<PagarmeSubscription | PagarmeError[]> {
  const client = await connectToPagarMe();

  let subscription: PagarmeSubscription;

  try {
    subscription = await client.subscriptions.update(data);

    return subscription;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
