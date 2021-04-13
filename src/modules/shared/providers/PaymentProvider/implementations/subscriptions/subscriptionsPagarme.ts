import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeSubscription } from '../../dtos/PagarmeSubscription';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function subscriptionsPagarme(): Promise<
  PagarmeSubscription[] | PagarmeError[]
> {
  const client = await connectToPagarMe();

  let subscriptions: PagarmeSubscription[];

  try {
    subscriptions = await client.subscriptions.all({}, '');

    return subscriptions;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
