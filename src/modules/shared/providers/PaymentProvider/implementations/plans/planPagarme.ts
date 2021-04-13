import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmePlan } from '../../dtos/PagarmePlan';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function listPlan(
  id: number,
): Promise<PagarmePlan | PagarmeError[]> {
  const client = await connectToPagarMe();

  let plan: PagarmePlan;

  try {
    plan = await client.plans.find({ id }, '');

    return plan;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
