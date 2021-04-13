/* eslint-disable @typescript-eslint/no-explicit-any */
import { PagarmeError } from '../dtos/PagarmeError';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function handleErrorPagarme(err: any): Promise<PagarmeError[]> {
  const errors: PagarmeError[] = err.response ? err.response.errors : err;

  console.log(errors);

  return errors;
}
