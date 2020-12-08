import { ObjectId } from "mongodb";
import { Arg, Mutation, Resolver, Query, FieldResolver, Root, Ctx } from "type-graphql";
import { sign } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import { ObjectIdScalar } from "../../../type-graphql/ObjectIdScalar";
import EditMeInput from "../inputs/EditMeInput";
import { IUser } from "../IUser";
import UserModel from "../UserModel";
import User from "../UserType";
import RegisterUserInput from "../inputs/RegisterUserInput";
import UserResponse from "./UserResponse";
import LoginUserInput from "../inputs/LoginUserInput";
import PostModel from "../../posts/PostModel";
import IPost from "../../posts/IPost";
import { ApolloContext } from "../../../apollo-server/ApolloContext";

@Resolver(_of => User)
export default class UserResolver {
  @Query(() => User, { nullable: true })
  public async me(@Arg("id", _type => ObjectIdScalar) id: ObjectId): Promise<IUser | null> {
    const user = await UserModel.findById(id);

    if (!user) {
      return null;
    }

    const populatedUser = await user.populate('posts').execPopulate();

    console.log(populatedUser.posts);

    return populatedUser;
  }
  
  @Query(() => [User], { description: 'Queries all users in database' })
  public async findAllUsers(): Promise<IUser[]> {
    return UserModel.find();
  }

  @Query(() => User, { nullable: true, description: 'Queries an user by providing an email. If none is found, return null.' })
  public async findUserByEmail(@Arg('email') email: string): Promise<IUser | null> {
    return UserModel.findOne({ email })
  }

  @Mutation(() => UserResponse)
  async register(@Arg('data'){
    name,
    surname,
    email,
    password
  }: RegisterUserInput): Promise<UserResponse> { 
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

    let user = {} as IUser;
    
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
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('loginData') {
      email,
      password,
    }: LoginUserInput,
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ email });

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

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user._id.toString(),
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('_id', () => ObjectIdScalar) _id: ObjectId,
    @Arg('updateData'){name, surname, email, password}: EditMeInput
  ): Promise<IUser | null> { 
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
        _id,
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
  }

  @FieldResolver()
  async posts(@Root() user: User): Promise<IPost[]> {
    return (await PostModel.find({ creator: user._doc._id }))!;
  }
}
