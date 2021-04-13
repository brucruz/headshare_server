import { PagarmeCard } from '../../dtos/PagarmeCard';
import { PagarmeError } from '../../dtos/PagarmeError';
import { connectToPagarMe } from '../connectToPagarme';
import { handleErrorPagarme } from '../handleErrorPagarme';

export async function cardsPagarme(): Promise<PagarmeCard[] | PagarmeError[]> {
  const client = await connectToPagarMe();

  let cards: PagarmeCard[];

  try {
    cards = await client.cards.all({}, '');

    return cards;
  } catch (err) {
    return handleErrorPagarme(err);
  }
}
