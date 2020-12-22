import { sign } from 'jsonwebtoken';
import authConfig from '../../../config/auth';

const { secret, expiresIn } = authConfig.jwt;

export default function generateJWTToken(userId: any): string {
  const token = sign({}, secret, {
    subject: userId.toString(),
    expiresIn,
  });

  return token;
}
