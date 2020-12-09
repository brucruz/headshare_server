import { ObjectId } from 'mongodb';
import {
  Arg,
  Mutation,
  Resolver,
  Query,
  FieldResolver,
  Root,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { sign } from 'jsonwebtoken';
import { verify } from 'argon2';
import authConfig from '../../../config/auth';
import { ObjectIdScalar } from '../../../type-graphql/ObjectIdScalar';
import EditMeInput from '../inputs/EditMeInput';
import { IUser } from '../IUser';
import UserModel from '../UserModel';
import User from '../UserType';
import RegisterUserInput from '../inputs/RegisterUserInput';
import LoginUserInput from '../inputs/LoginUserInput';
import PostModel from '../../posts/PostModel';
import IPost from '../../posts/IPost';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import isAuth from '../../../middlewares/isAuth';
import UserResponse from './UserResponse';
import UsersResponse from './UsersResponse';
import LoggedUserResponse from './LoggedUserResponse';
import Post from '../../posts/PostType';

@Resolver(() => User)
export default class UserResolver {
  @UseMiddleware(isAuth)
  @Query(() => UserResponse, { nullable: true })
  public async me(
    // @Arg('id', () => ObjectIdScalar) id: ObjectId,
    @Ctx() { req }: ApolloContext,
  ): Promise<UserResponse> {
    if (!req.user) {
      return {
        errors: [
          {
            field: 'id',
            message: 'Invalid JWT token',
          },
        ],
      };
    }

    const userId = req.user.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No user found with the informed id',
          },
        ],
      };
    }

    return {
      user,
    };
  }

  @Query(() => UsersResponse, { description: 'Queries all users in database' })
  public async findAllUsers(): Promise<UsersResponse> {
    const users = await UserModel.find();

    return { users };
  }

  @Query(() => UserResponse, {
    nullable: true,
    description:
      'Queries an user by providing an email. If none is found, return null.',
  })
  public async findUserByEmail(
    @Arg('email') email: string,
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'No user found with this email',
          },
        ],
      };
    }

    return { user };
  }

  @Mutation(() => LoggedUserResponse)
  async register(
    @Arg('data') { name, surname, email, password }: RegisterUserInput,
  ): Promise<LoggedUserResponse> {
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
    let token = '';

    try {
      user = await UserModel.create({
        name,
        surname,
        email: email.toLowerCase(),
        password,
      });

      const { secret, expiresIn } = authConfig.jwt;

      token = sign({}, secret, {
        subject: user._id.toString(),
        expiresIn,
      });
    } catch (err) {
      if (err.code === 11000 || err.message.includes('duplicate key error')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'There is already an account registered with this email',
            },
          ],
        };
      }
    }
    return {
      data: {
        user,
        token,
      },
    };
  }

  @Mutation(() => LoggedUserResponse)
  async login(
    @Arg('loginData') { email, password }: LoginUserInput,
  ): Promise<LoggedUserResponse> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return {
        errors: [
          {
            field: 'email or password',
            message: 'Email/password combination is invalid',
          },
        ],
      };
    }

    const correctPassword = await verify(user.password!, password);

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
      data: {
        user,
        token,
      },
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updateUser(
    @Arg('_id', () => ObjectIdScalar) _id: ObjectId,
    @Arg('updateData') { name, surname, email, password }: EditMeInput,
  ): Promise<UserResponse> {
    const newData = {
      $set: {
        ...(name ? { name } : {}),
        ...(surname ? { surname } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
      },
    };

    const user = await UserModel.findOneAndUpdate(
      {
        _id,
      },
      { ...newData },
      {
        new: true,
      },
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'id',
            message: 'No user found with this id',
          },
        ],
      };
    }

    await user.save();

    return {
      user,
    };
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User): Promise<IPost[]> {
    return (await PostModel.find({ creator: user._doc._id }))!;
  }
}
