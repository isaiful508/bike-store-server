import { NextFunction, Request, Response } from "express";
import { OrderServices } from "./order.service";
import { orderValidationSchema } from "./orderValidation";
import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/SendResponse";
import { StatusCodes } from "http-status-codes";

// Create an Order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedOrder = orderValidationSchema.parse(req.body.data);

    const productDetails = validatedOrder.products.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product),
      quantity: item.quantity,
    }));
    const client_ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress;

     //@ts-ignore
    const result = await OrderServices.createOrder({
     
      user: validatedOrder.user,
      products: productDetails,
    },
      client_ip);

    res.status(201).json({
      message: "Order created successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get Total Revenue
const totalRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const revenue = await OrderServices.calculateRevenue();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      success: true,
      data: { totalRevenue: revenue },
    });
  } catch (error) {
    next(error);
  }
}

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderServices.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
  });
});

//get all orders
const getAllOrders = catchAsync(async (req, res) => {
  const order = await OrderServices.getAllOrders();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: order,
  });
});

export const OrderControllers = {
  createOrder,
  totalRevenue,
  verifyPayment,
  getAllOrders,
}