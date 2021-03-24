import DataLoader from 'dataloader';
import { IUser } from './IUser';
import UserModel from './UserModel';

const userLoader = (): DataLoader<any, IUser, any> =>
  new DataLoader<any, IUser>(async userIds => {
    const users = await UserModel.find({
      _id: { $in: userIds },
    });

    const userIdToUser: Record<any, IUser> = {};

    users.forEach(u => {
      userIdToUser[u._id] = u;
    });

    return userIds.map(userId => userIdToUser[userId]);
  });

export default userLoader;
