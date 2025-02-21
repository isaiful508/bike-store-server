import ProductModel from "../product/product.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import OrderModel from './order.model';
import { orderUtils } from "./order.utils";


const createOrder = async (orderDetails: IOrder, client_ip: string) => {
  const { user: userId, products } = orderDetails;


  if (!products || !products.length) {
    throw new Error("No products specified in the order.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
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

  //payment integration
  const surjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: user.name,
    customer_address: user.address || "N/A",
    customer_email: user.email,
    customer_phone: user.phone || "N/A",
    customer_city: user.city || "N/A",
    client_ip
  }

  const payment =  await  orderUtils.makePaymentAsync(surjopayPayload);

  return {order, payment};
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