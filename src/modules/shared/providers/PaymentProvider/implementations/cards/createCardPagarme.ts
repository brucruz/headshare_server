import { PagarmeCard } from '../../dtos/PagarmeCard';
import { PagarmeCreateCard } from '../../dtos/PagarmeCreateCard';
import { PagarmeError } from '../../dtos/PagarmeError';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function createCardPagarme(
  data: PagarmeCreateCard,
): Promise<PagarmeCard | PagarmeError[]> {
  const client = await connectToPagarMe();

  let card: PagarmeCard;

  try {
    card = await client.cards.create(data, '');

    return card;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
