import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmePlan } from '../../dtos/PagarmePlan';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function plansPagarme(): Promise<PagarmePlan[] | PagarmeError[]> {
  const client = await connectToPagarMe();

  let plans: PagarmePlan[];

  try {
    plans = await client.plans.all({}, '');

    return plans;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
