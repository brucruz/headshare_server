import { PagarmeCreatePlan } from '../../dtos/PagarmeCreatePlan';
import { PagarmeError } from '../../dtos/PagarmeError';
import { PagarmePlan } from '../../dtos/PagarmePlan';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function createPlanPagarme(
  config: PagarmeCreatePlan,
): Promise<PagarmePlan | PagarmeError[]> {
  const client = await connectToPagarMe();

  let plan: PagarmePlan;

  try {
    plan = await client.plans.create(config, '');

    return plan;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
