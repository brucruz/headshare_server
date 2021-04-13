import { Document } from 'mongoose';
import { registerEnumType } from 'type-graphql';
import Post from '../posts/PostType';
import Role from '../roles/RoleType';

export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighbourhood?: string;
  city: string;
  zipcode: string;
  state?: string;
  country: string;
}

export interface IPhone {
  countryCode: string;
  regionalCode?: string;
  phone: string;
}

// eslint-disable-next-line no-shadow
export enum DocumentIdType {
  CPF = 'cpf',
  PASSPORT = 'passport',
  CNPJ = 'cnpj',
}

registerEnumType(DocumentIdType, {
  name: 'DocumentIdType',
  description: 'Acceptable documents for using the platform',
  valuesConfig: {
    CPF: {},
    PASSPORT: {},
    CNPJ: {},
  },
});

export interface IPersonalDocument {
  type: Exclude<DocumentIdType, DocumentIdType.CNPJ>;
  number: string;
}

export interface IUser extends Document {
  name: string;
  surname?: string;
  password?: string;
  email: string;
  avatar?: string;
  address?: IAddress;
  documents: IPersonalDocument[];
  phone?: IPhone;
  birthday?: Date;
  posts: Post[];
  roles: Role[];
  isActive?: boolean;
  removedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  authenticate: (plainTextPassword: string) => Promise<boolean>;
}
