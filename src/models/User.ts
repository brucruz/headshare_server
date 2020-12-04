import { getModelForClass, pre, prop as Property } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { verify, hash } from 'argon2';

@pre<User>('save', async function preSave() {
  if (this.isModified('password') && this.password) {
    this.password = await UserModel.encryptPassword(this.password);
  }
})

@pre('update', preUpdate)
@pre('updateMany', preUpdate)
@pre('updateOne', preUpdate)
@pre('findOneAndUpdate', preUpdate)

// @pre<User>('insertMany', async function preInsertMany(_next, users) {
//   for await (const user of users) {
//     if (!user.password) {
//       continue;
//     }
//     const hash = await this.encryptPassword(user.password);
//     user.password = hash;
//   }
// })

@ObjectType({ description: 'The Users model' })
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'User name' })
  @Property({ trim: true, required: true })
  name: string;

  @Field({ description: 'User surname', nullable: true })
  @Property({ trim: true })
  surname?: string;

  @Field({ description: 'User email to be used on login' })
  @Property({ trim: true, required: true, unique: true })
  email: string;

  @Property()
  password?: string;

  @Field({ description: 'User creation date' })
  createdAt?: Date;
  
  @Field({ description: 'User last update date', nullable: true })
  updatedAt?: Date;

  static async encryptPassword(password: string): Promise<string> {
    return hash(password);
  }

  public async authenticate(plainText: string) {
    try {
      return verify(this.password || '', plainText);
    } catch (err) {
      return false;
    }
  }
}

export const UserModel = getModelForClass(User, { schemaOptions: {
  collection: 'users',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'createdAt',
  },
} });

async function preUpdate(this: any) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await UserModel.encryptPassword(update.password);
  }
  if (update.$set && update.$set.password) {
    update.$set.password = await UserModel.encryptPassword(update.$set.password);
  }
}


