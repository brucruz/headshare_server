import { Document } from 'mongoose';
import Community from '../communities/CommunityType';

export interface ProductBenefit {
  description: string;
  order: number;
}

export default interface IProduct extends Document {
  name: string;
  description: string;
  benefits: ProductBenefit[];
  statementDescriptor?: string;
  stripeProductId: string;
  community: Community;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
