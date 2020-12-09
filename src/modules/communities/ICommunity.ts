import { Document } from 'mongoose';

export default interface ICommunity extends Document {
  logo?: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
