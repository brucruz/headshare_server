/* eslint-disable import/prefer-default-export */
/* eslint-disable no-multi-assign */
import { hash } from 'argon2';
import CardModel from '../modules/cards/CardModel';
import { ICard } from '../modules/cards/ICard';
import CreateCardInput from '../modules/cards/inputs/CreateCardInput';
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

export const startCounters = (): void => {
  global.__COUNTERS__ = {
    user: 0,
    community: 0,
    post: 0,
    card: 0,
  };
};

export const restartCounters = (): void => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce(
    (prev, curr) => ({ ...prev, [curr]: 0 }),
    {} as NodeJS.Counters,
  );
};

export const createUser = async (
  args: DeepPartial<RegisterUserInput> = {},
): Promise<IUser> => {
  const { name, email, password, ...rest } = args;

  const n = (global.__COUNTERS__.user += 1);

  const user = await new UserModel({
    name: name || `Normal user ${n}`,
    email: email || `user-${n}@example.com`,
    password: await hash(password || '123456789'),
    ...rest,
  }).save();

  return user;
};

export const createCard = async (
  args: DeepPartial<CreateCardInput> = {},
  user: IUser,
): Promise<ICard> => {
  const { holderName, expirationDate, ...rest } = args;

  const n = (global.__COUNTERS__.card += 1);

  const cards = await CardModel.find({ user: user._id });

  const card = await new CardModel({
    pagarmeId: `000${n}`,
    brand: `Test`,
    holderName: holderName || `Normal User ${n}`,
    firstDigits: `1234${n}`,
    lastDigits: `78${n}`,
    fingerprint: `iohnmgiigndq${n}ouiyb78t`,
    valid: true,
    expirationDate: expirationDate || '1299',
    isMain: !(cards.length > 0),
    user: user._id,
    ...rest,
  }).save();

  return card;
};
