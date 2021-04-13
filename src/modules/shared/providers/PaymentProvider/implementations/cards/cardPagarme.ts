import { PagarmeCard } from '../../dtos/PagarmeCard';
import { PagarmeError } from '../../dtos/PagarmeError';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function cardPagarme(
  id: string,
): Promise<PagarmeCard | PagarmeError[]> {
  const client = await connectToPagarMe();

  let card: PagarmeCard;

  try {
    card = await client.cards.find({ id }, '');

    return card;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
