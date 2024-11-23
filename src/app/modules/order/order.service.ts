import ProductModel from "../product/product.model";
import { Order } from "./order.interface";
import OrderModel from './order.model';


const createOrder = async (orderDetails: Order) => {

  const { email, product, quantity, totalPrice } = orderDetails;
  console.log({ orderDetails });



  // Fetch the product
  const productData = await ProductModel.findById(product);
  if (!productData) {
    throw new Error('Product not found');
  }

  // Check stock
  if (productData.quantity < quantity) {
    throw new Error('Insufficient stock available');
  }

  // Reduce stock and update inStock status
  productData.quantity -= quantity;
  if (productData.quantity === 0) {
    productData.inStock = false;
  }
  await productData.save();

  // Create the order
  const order = await OrderModel.create({
    email,
    product,
    quantity,
    totalPrice,
  });

  return order;
}

//calculate revenue
const calculateRevenue = async () => {
  try {
    const revenue = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    return revenue.length > 0 ? revenue[0].totalRevenue : 0;
  } catch (error) {
    console.error('Error calculating revenue:', error);
    throw new Error('Failed to calculate revenue');
  }
};





export const OrderServices = {
  createOrder,
  calculateRevenue,
}