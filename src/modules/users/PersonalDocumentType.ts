import { Field, ObjectType } from 'type-graphql';
import { DocumentIdType } from './IUser';

@ObjectType({ description: 'Personal Document Model' })
export default class PersonalDocument {
  @Field(() => String, {
    description: 'Document id type, excluding company documents',
  })
  type: Exclude<DocumentIdType, DocumentIdType.CNPJ>;

  @Field(() => String, { description: 'Document id number' })
  number: string;
}
