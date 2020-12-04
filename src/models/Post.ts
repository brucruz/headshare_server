import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'The Posts model' })
export class Post {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Post title' })
  @Property({ trim: true, required: true })
  title: string;

  @Field({ description: 'Post content' })
  @Property({ required: true })
  content: string;

  @Field({ description: 'Post creation date' })
  createdAt?: Date;
  
  @Field({ description: 'Post last update date', nullable: true })
  updatedAt?: Date;
}

export const PostModel = getModelForClass(Post, { schemaOptions: {
  collection: 'posts',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'createdAt',
  },
} });
