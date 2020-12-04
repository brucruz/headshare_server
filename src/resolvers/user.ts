import { mongoose } from "@typegoose/typegoose";
import { Arg, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";

import { User, UserModel } from "../models/User";
import { LoginInput, RegisterInput, UpdateUserInput } from "./types/userInput";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  
  @Field()
  message: string;
}

@Resolver(_of => User)
export class UserResolver {
  @Query(() => [User], { description: 'Queries all users in database' })
  async findAllUsers(): Promise<User[]> {
    return UserModel.find();
  };

  @Query(() => User, { nullable: true, description: 'Queries an user by providing an email. If none is found, return null.' })
  async findUserByEmail(@Arg('email') email: string): Promise<User | null> {
    return UserModel.findOne({ email })
  }

  @Mutation(() => UserResponse)
  async register(@Arg('data'){
    name,
    surname,
    email,
    password
  }: RegisterInput): Promise<UserResponse> { 
    if (email.length <= 2) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Not a valid email',
          },
        ],
      };
    }

    if (password.length < 6) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password should be greater than 6 characters',
          },
        ],
      };
    }

    let user = {} as User;
    
    try {
      user = await UserModel.create({
          name,
          surname,
          email: email.toLowerCase(),
          password,
      });

    } catch (err) {
      if (err.code === 11000 || err.message.includes('duplicate key error')) {
        return {
          errors: [{
            field: 'email',
            message: 'There is already an account registered with this email'
          }],
        };
      }
    }

    return {
      user,
    };
  };

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('id') id: string,
    @Arg('updateData'){name, surname, email, password}: UpdateUserInput
  ): Promise<User | null> { 
    const newData = {
      $set: {
        ...(name ? { name } : {}),
        ...(surname ? { surname } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
      }
    };

    const user = await UserModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      }, { ...newData },
      {
        new: true,
      }
    );

    if (!user) {
      return null;
    }

    await user.save()

    return user;
  };

  @Mutation(() => UserResponse)
  async login(
    @Arg('loginData') {
      email,
      password,
    }: LoginInput): Promise<UserResponse> {
    const user = await this.findUserByEmail(email.toLowerCase());

    if (!user) {
      return {
        errors: [{
          field: 'email or password',
          message: 'Email/password combination is invalid',
        }]
      }
    }
    
    const correctPassword = await user.authenticate(password);
    
    if (!correctPassword) {
      return {
        errors: [
          {
            field: 'email or password',
          message: 'Email/password combination is invalid',
          },
        ],
      };
    }

    return {
      user
    };
  }
}
