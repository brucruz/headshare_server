import { PagarmeCreateRecipient } from '../../dtos/PagarmeCreateRecipient';
import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeRecipient } from '../../dtos/PagarmeRecipient';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function createRecipientPagarme(
  data: PagarmeCreateRecipient,
): Promise<PagarmeRecipient | PagarmeError[]> {
  const client = await connectToPagarMe();

  let recipient: PagarmeRecipient;

  try {
    recipient = await client.recipients.create(data);

    return recipient;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
