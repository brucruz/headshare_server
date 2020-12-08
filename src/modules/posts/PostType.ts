import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { ObjectIdScalar } from "../../type-graphql/ObjectIdScalar";
import User from "../users/UserType";

@ObjectType({ description: 'The Posts model' })
export class Post {
  @Field(() => ObjectIdScalar)
  readonly _id: typeof ObjectId;

  @Field(() => String, { description: 'Post title' })
  title: string;

  @Field({ description: 'Post content' })
  content: string;

  @Field({ description: 'Number of likes this post has received', defaultValue: 0 })
  likes?: number;

  @Field(_type => User)
  creator: ObjectId;
  
  _doc?: any;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  removedAt: Date;

  @Field({ description: 'Post creation date' })
  createdAt: Date;
  
  @Field({ description: 'Post last update date', nullable: true })
  updatedAt: Date;
}
