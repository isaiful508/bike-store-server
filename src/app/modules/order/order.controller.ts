import { Request, Response } from "express";
import { OrderServices } from "./order.service";


const createOrder = async (req: Request, res: Response) => {
    {
        try {
            const payload = req.body.data;
            const result = await OrderServices.createOrder(payload);
            res.status(201).json({
                message: 'Order created successfully',
                status: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                message: error.message || 'Failed to place order',
                status: false,
            });
        }
    }
}

export const OrderControllers = {
    createOrder
}