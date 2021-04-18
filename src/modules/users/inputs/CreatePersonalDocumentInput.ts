import { Field, InputType } from 'type-graphql';
import { DocumentIdType } from '../IUser';

@InputType()
export default class CreatePersonalDocumentInput {
  @Field(() => DocumentIdType, {
    description: 'Document id type, excluding company documents',
  })
  // type: Exclude<DocumentIdType, DocumentIdType.CNPJ>;
  type: DocumentIdType;

  @Field(() => String, { description: 'Document id number' })
  number: string;
}
