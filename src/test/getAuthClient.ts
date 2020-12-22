import ApolloClient from 'apollo-boost';
import generateJWTToken from '../modules/users/resolvers/generateJWTToken';
import { createUser } from './createRows';

const getAuthClient = async (): Promise<ApolloClient<unknown>> => {
  const user = await createUser();

  const token = generateJWTToken(user._id);

  return new ApolloClient({
    uri: 'http://localhost:4000/',
    request: operation => {
      if (token) {
        operation.setContext({
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }
    },
    onError: e => {
      console.log(e);
    },
  });
};

export default getAuthClient;
