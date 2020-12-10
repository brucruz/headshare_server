import { ExecutionResult, graphql } from 'graphql';
import * as schemaPromise from '../graphql/schema';

const runQuery = async (
  source: string,
  variables: any,
  _ctx = {},
): Promise<
  ExecutionResult<
    {
      [key: string]: any;
    },
    {
      [key: string]: any;
    }
  >
> => {
  const schema = await schemaPromise.default;

  return graphql(schema, source, null, {}, variables);
};

export default runQuery;
