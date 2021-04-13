/* eslint-disable camelcase */
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';
import { PagarmeSubscription } from '../../dtos/PagarmeSubscription';
import { PagarmeCreateSubscription } from '../../dtos/PagarmeCreateSubscription';
import { PagarmeError } from '../../dtos/PagarmeError';

export async function createSubscriptionPagarme(
  data: PagarmeCreateSubscription,
): Promise<PagarmeSubscription | PagarmeError[]> {
  const client = await connectToPagarMe();

  const { soft_descriptor, ...rest } = data;

  const adjustedSoftDescriptor =
    soft_descriptor && soft_descriptor.slice(0, 12);

  const subscriptionData = soft_descriptor
    ? { ...rest, soft_descriptor: adjustedSoftDescriptor }
    : rest;

  let subscription: PagarmeSubscription;

  try {
    subscription = await client.subscriptions.create(subscriptionData, '');

    return subscription;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
