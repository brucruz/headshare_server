import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeTransfer } from '../../dtos/PagarmeZipcodeResponse';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function transferPagarme(
  id: number,
): Promise<PagarmeTransfer | PagarmeError[]> {
  const client = await connectToPagarMe();

  let transfer: PagarmeTransfer;

  try {
    transfer = await client.transfers.find({ id });

    return transfer;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
