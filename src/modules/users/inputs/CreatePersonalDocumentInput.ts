import { Field, InputType } from 'type-graphql';
import { DocumentIdType } from '../IUser';

@InputType()
export default class CreatePersonalDocumentInput {
  @Field(() => String, {
    description: 'Document id type, excluding company documents',
  })
  type: Exclude<DocumentIdType, DocumentIdType.CNPJ>;

  @Field(() => String, { description: 'Document id number' })
  number: string;
}
