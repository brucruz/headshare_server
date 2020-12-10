import mongoose from 'mongoose';
import 'dotenv/config';
import 'reflect-metadata';

export const cleanDB = async (cb: any): Promise<void> => {
  await mongoose.connection.db.dropDatabase();
  cb();
};

export const connectToDB = async (): Promise<typeof mongoose> => {
  jest.setTimeout(20000);

  const mongoURL =
    'mongodb://localhost:27017/test-creators-communities-project';

  const connection = await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  return connection;
};

export const disconnectDB = (cb = () => {}) => {
  mongoose.disconnect(cb);
};

export const generateMongooseId = (): mongoose.Types.ObjectId => {
  return mongoose.Types.ObjectId();
};
