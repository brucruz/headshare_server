import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmePlan } from '../../dtos/PagarmePlan';
import { PagarmeUpdatePlan } from '../../dtos/PagarmeUpdatePlan';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function updatePlanPagarme(
  config: PagarmeUpdatePlan,
): Promise<PagarmePlan | PagarmeError[]> {
  const client = await connectToPagarMe();

  let plan: PagarmePlan;

  try {
    plan = await client.plans.update(config, '');

    return plan;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
