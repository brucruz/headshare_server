import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { ApolloContext } from '../apollo-server/ApolloContext';
import authConfig from '../config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const isAuth: MiddlewareFn<ApolloContext> = ({ context }, next) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    // return {
    //   errors: [
    //     {
    //       field: 'auth',
    //       message: 'JWT token is missing',
    //       status: 401,
    //     }
    //   ],
    // }
    throw new Error('JWT token is missing');
  }

  // Bearer token
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    context.req.user = {
      id: sub,
    };

    return next();
  } catch {
    // return {
    //   errors: [
    //     {
    //       field: 'auth',
    //       message: 'Invalid JWT token',
    //       status: 401,
    //     }
    //   ],
    // }
    throw new Error('Invalid JWT token');
  }
};

export default isAuth;
