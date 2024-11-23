import { Request, Response } from "express";
import { OrderServices } from "./order.service";

//create order
const createOrder = async (req: Request, res: Response) => {
    {
        try {
            const payload = req.body.data;
            const result = await OrderServices.createOrder(payload);
            res.status(200).json({
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

//total revenue
const totalRevenue = async (req: Request, res: Response) => {
    try {
        const totalRevenue = await OrderServices.calculateRevenue();
        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: { totalRevenue },
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'Failed to calculate revenue',
            status: false,
        });
    }
}




export const OrderControllers = {
    createOrder,
    totalRevenue
}