/* eslint-disable no-shadow */
import { Product } from 'aws-sdk/clients/ssm';
import { Document } from 'mongoose';
import { registerEnumType } from 'type-graphql';

export enum RecurringInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

registerEnumType(RecurringInterval, {
  name: 'RecurringInterval',
  description: 'The possible diferent periods a recurring price might take',
  valuesConfig: {
    DAY: {},
    WEEK: {},
    MONTH: {},
    YEAR: {},
  },
});

export enum PriceType {
  ONETIME = 'ONETIME',
  RECURRING = 'RECURRING',
}

registerEnumType(PriceType, {
  name: 'PriceType',
  description:
    'Especifies if the customer has to pay once or repeately to mantain access to the product',
  valuesConfig: {
    ONETIME: {},
    RECURRING: {},
  },
});

export default interface IPrice extends Document {
  currency: string;
  nickname?: string;
  type: PriceType;
  recurringInterval?: RecurringInterval;
  recurringIntervalCount?: number;
  amount: number;
  trialDays?: number;
  stripePriceId: string;
  product: Product;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
