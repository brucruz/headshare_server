/* eslint-disable camelcase */
export type PagarmeRegisterInformation =
  | ({
      document_number: string;
      site_url?: string;
      email: string;
      phone_numbers?: {
        ddd: string;
        number: '11987654321';
        type: string;
      }[];
    } & {
      type: 'individual';
      name: string;
    })
  | {
      type: 'corporation';
      company_name: string;
      managing_partners: {
        type: 'individual';
        email: string;
        name: string;
      };
    };
