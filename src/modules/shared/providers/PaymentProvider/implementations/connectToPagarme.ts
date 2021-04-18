import pagarme from 'pagarme';
import { handleErrorPagarme } from './handleErrorPagarme';

export async function connectToPagarMe(): Promise<typeof pagarme.client> {
  let client: typeof pagarme.client;

  try {
    client = await pagarme.client.connect({
      api_key: process.env.PAGARME_APIKEY,
    });
  } catch (err) {
    handleErrorPagarme(err);
  }

  return client;
}
