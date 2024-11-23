import { Types } from 'mongoose';

export type Order = {
    email: string;
    product: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }