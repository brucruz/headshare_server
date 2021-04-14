import { Document } from 'mongoose';
import User from '../users/UserType';

export interface ICard extends Document {
  pagarmeId: string;
  brand: string;
  holderName: string;
  firstDigits: string;
  lastDigits: string;
  fingerprint: string;
  valid: boolean;
  expirationDate: string;
  isMain: boolean;
  user: User;
  isActive?: boolean;
  removedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
