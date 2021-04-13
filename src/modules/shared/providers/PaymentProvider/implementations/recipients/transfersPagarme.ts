import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeTransfer } from '../../dtos/PagarmeZipcodeResponse';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function transfersPagarme(): Promise<
  PagarmeTransfer[] | PagarmeError[]
> {
  const client = await connectToPagarMe();

  let transfers: PagarmeTransfer[];

  try {
    transfers = await client.transfers.all({ count: 10, page: 1 });
  } catch (err) {
    return handleErrorPagarme(err);
  }

  return transfers;
}
