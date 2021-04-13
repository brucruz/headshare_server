import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeRecipient } from '../../dtos/PagarmeRecipient';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function recipientPagarme(
  id: string,
): Promise<PagarmeRecipient | PagarmeError[]> {
  const client = await connectToPagarMe();

  let recipient: PagarmeRecipient;

  try {
    recipient = await client.recipients.find({ id });

    return recipient;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
