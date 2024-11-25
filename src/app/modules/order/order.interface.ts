import mongoose from 'mongoose';

export type Order = {
    email: string;
    product?: mongoose.Schema.Types.ObjectId;
    quantity: number;
    totalPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
  }