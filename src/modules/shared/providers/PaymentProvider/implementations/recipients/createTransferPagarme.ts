import { PagarmeCreateTransfer } from '../../dtos/PagarmeCreateTransfer';
import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeTransfer } from '../../dtos/PagarmeZipcodeResponse';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function createTransferPagarme(
  data: PagarmeCreateTransfer,
): Promise<PagarmeTransfer | PagarmeError[]> {
  const client = await connectToPagarMe();

  let transfer: PagarmeTransfer;

  try {
    transfer = await client.transfers.create(data);

    return transfer;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
