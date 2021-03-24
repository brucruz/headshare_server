import { Field, ObjectType } from 'type-graphql';
import IPost from '../IPost';
import Post from '../PostType';

@ObjectType()
export default class PaginatedPosts {
  @Field(() => [Post])
  posts: IPost[];

  @Field()
  hasMore: boolean;
}
