import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';


const OrderSchema = new Schema<IOrder>(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      products: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      totalPrice: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
  );
  
  export const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;