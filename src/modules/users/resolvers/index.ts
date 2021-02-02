import { ObjectId } from 'mongodb';
import {
  Arg,
  Mutation,
  Resolver,
  Query,
  FieldResolver,
  Root,
  Ctx,
} from 'type-graphql';
import { hash, verify } from 'argon2';
import ObjectIdScalar from '../../../type-graphql/ObjectIdScalar';
import EditMeInput from '../inputs/EditMeInput';
import { IUser } from '../IUser';
import UserModel from '../UserModel';
import User from '../UserType';
import RegisterUserInput from '../inputs/RegisterUserInput';
import LoginUserInput from '../inputs/LoginUserInput';
import PostModel from '../../posts/PostModel';
import IPost from '../../posts/IPost';
import { ApolloContext } from '../../../apollo-server/ApolloContext';
import UserResponse from './UserResponse';
import UsersResponse from './UsersResponse';
import LoggedUserResponse from './LoggedUserResponse';
import Post from '../../posts/PostType';
import Role from '../../roles/RoleType';
import IRole from '../../roles/IRole';
import RoleModel from '../../roles/RoleModel';
import { COOKIE_NAME } from '../../../constants';

@Resolver(() => User)
export default class UserResolver {
  @Query(() => UserResponse, { nullable: true })
  public async me(@Ctx() { req }: ApolloContext): Promise<UserResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: 'id',
            message: 'User not logged in',
          },
        ],
      };
    }

    const { userId } = req.session;

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
  public async users(): Promise<UsersResponse> {
    const users = await UserModel.find();

    return { users };
  }

  @Query(() => UserResponse, {
    nullable: true,
    description:
      'Queries an user by providing an email. If none is found, return null.',
  })
  public async findUserByEmail(
    @Arg('email', () => String) email: string,
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
    @Arg('data', () => RegisterUserInput)
    { name, surname, email, password }: RegisterUserInput,
    @Ctx() { req }: ApolloContext,
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

    const checkIfExists = await UserModel.findOne({ email });

    if (checkIfExists) {
      return {
        errors: [
          {
            field: 'email',
            message: 'There is already an user registered with this email',
          },
        ],
      };
    }

    let user = {} as IUser;
    // let token = '';

    try {
      user = new UserModel({
        name,
        surname,
        email: email.toLowerCase(),
        password: await hash(password),
      });

      await user.save();

      req.session.userId = user.id;
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
      },
    };
  }

  @Mutation(() => LoggedUserResponse)
  async login(
    @Arg('loginData', () => LoginUserInput) { email, password }: LoginUserInput,
    @Ctx() { req }: ApolloContext,
  ): Promise<LoggedUserResponse> {
    const user = await UserModel.findOne({ email });

    console.log('found user? ', user);

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

    if (!user.password) {
      return {
        errors: [
          {
            field: 'email or password',
            message: 'Email/password combination is invalid',
          },
        ],
      };
    }

    const correctPassword = await verify(user.password, password);

    console.log('correct password? ', correctPassword);

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

    req.session.userId = user.id;

    console.log('req.session: ', req.session);

    return {
      data: {
        user,
      },
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updateUser(
    @Arg('_id', () => ObjectIdScalar) _id: ObjectId,
    @Arg('updateData', () => EditMeInput)
    { name, surname, email, password, avatar }: EditMeInput,
  ): Promise<UserResponse> {
    const newData = {
      $set: {
        ...(name ? { name } : {}),
        ...(surname ? { surname } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password: await hash(password) } : {}),
        ...(avatar ? { avatar } : {}),
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

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ApolloContext): Promise<boolean> {
    return new Promise(resolve => {
      req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          console.log(err);

          resolve(false);

          return;
        }

        resolve(true);
      });
    });
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User): Promise<IPost[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await PostModel.find({ creator: user._doc._id }))!;
  }

  @FieldResolver(() => [Role])
  async roles(@Root() user: User): Promise<IRole[]> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await RoleModel.find({ user: user._doc._id }))!;
  }
}
