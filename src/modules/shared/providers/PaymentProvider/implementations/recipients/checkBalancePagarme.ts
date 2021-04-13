import { PagarmeBalance } from '../../dtos/PagarmeBalance';
import { PagarmeError } from '../../dtos/PagarmeError';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function checkBalancePagarme(
  id: string,
): Promise<PagarmeBalance | PagarmeError[]> {
  const client = await connectToPagarMe();

  let balance: PagarmeBalance;

  try {
    balance = await client.balance.find(id);

    return balance;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
