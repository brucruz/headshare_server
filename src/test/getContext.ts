import { ApolloContext } from '../apollo-server/ApolloContext';

interface ContextVars {
  user?: {
    id: string;
  };
}

const getContext = async (ctx: ContextVars = {}): Promise<ApolloContext> => {
  // create context
  const context = { ...ctx };

  // load user

  return {
    req,
    res,
  };
};

export default getContext;
