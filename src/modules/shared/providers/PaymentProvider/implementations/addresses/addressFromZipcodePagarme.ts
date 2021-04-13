import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmeZipcodeResponse } from '../../dtos/PagarmeTransfer';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function addressFromZipcodePagarme(
  zipcode: string,
): Promise<PagarmeZipcodeResponse | PagarmeError[]> {
  const client = await connectToPagarMe();

  let address: PagarmeZipcodeResponse;

  try {
    address = await client.zipcodes.find({ zipcode });

    return address;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
