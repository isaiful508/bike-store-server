import { NextFunction, Request, Response } from "express";
import { OrderServices } from "./order.service";
import { orderValidationSchema } from "./orderValidation";

// Create an Order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request payload
      const validatedOrder = orderValidationSchema.parse(req.body.data);
  
      const result = await OrderServices.createOrder(validatedOrder);
  
      res.status(201).json({
        message: 'Order created successfully',
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




export const OrderControllers = {
    createOrder,
    totalRevenue
}