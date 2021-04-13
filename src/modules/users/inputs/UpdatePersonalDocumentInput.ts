import { Field, InputType } from 'type-graphql';
import { DocumentIdType } from '../IUser';

@InputType()
export default class UpdatePersonalDocumentInput {
  @Field(() => String, {
    description: 'Document id type, excluding company documents',
    nullable: true,
  })
  type?: Exclude<DocumentIdType, DocumentIdType.CNPJ>;

  @Field(() => String, { description: 'Document id number', nullable: true })
  number?: string;
}
