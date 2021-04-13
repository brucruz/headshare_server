import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeRecipient } from '../../dtos/PagarmeRecipient';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function recipientsPagarme(): Promise<
  PagarmeRecipient[] | PagarmeError[]
> {
  const client = await connectToPagarMe();

  let recipients: PagarmeRecipient[];

  try {
    recipients = await client.recipients.all({ count: 10, page: 1 });

    return recipients;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
