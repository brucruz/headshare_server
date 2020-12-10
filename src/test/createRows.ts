/* eslint-disable import/prefer-default-export */
/* eslint-disable no-multi-assign */
import { hash } from 'argon2';
import RegisterUserInput from '../modules/users/inputs/RegisterUserInput';
import { IUser } from '../modules/users/IUser';
import UserModel from '../modules/users/UserModel';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export const createUser = async (
  args: DeepPartial<RegisterUserInput> = {},
): Promise<IUser> => {
  const { name, email, password, ...rest } = args;

  return new UserModel({
    name: name || 'User #$',
    email: email || 'user@example.com',
    password: await hash(password || '123456789'),
    ...rest,
  }).save();
};
