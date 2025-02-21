import ProductModel from "../product/product.model";
import { IOrder } from "./order.interface";
import OrderModel from './order.model';


const createOrder = async (orderDetails: IOrder) => {
  const { user , products } = orderDetails;

  if (!products || !products.length) {
    throw new Error("No products specified in the order.");
  }

  let totalPrice = 0;

  const productDetails = await Promise.all(
    products.map(async (item) => {
      const productData = await ProductModel.findById(item.product);
      if (!productData) {
        throw new Error(`Product not found: ${item.product}`);
      }

      if (productData.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${productData.name}`);
      }

      const subtotal = productData.price * item.quantity;
      totalPrice += subtotal;

      return {
        product: productData._id,
        quantity: item.quantity,
        price: productData.price,
        subtotal,
      };
    })
  );

  await Promise.all(
    products.map(async (item) => {
      const productData = await ProductModel.findById(item.product);
      if (productData) {
        productData.quantity -= item.quantity;
        if (productData.quantity === 0) {
          productData.inStock = false;
        }
        await productData.save();
      }
    })
  );

  // Create the order
  const order = await OrderModel.create({
    user,
    products: productDetails,
    totalPrice,
  });

  return order;
};
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
    // eslint-disable-next-line
    console.error('Error calculating revenue:', error);
    throw new Error('Failed to calculate revenue');
  }
};





export const OrderServices = {
  createOrder,
  calculateRevenue,
}