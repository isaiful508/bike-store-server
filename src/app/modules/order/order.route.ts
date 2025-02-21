import express from "express";
import { OrderControllers } from "./order.controller";


const router = express.Router();

router.post('/orders', OrderControllers.createOrder);

router.get('/orders/revenue', OrderControllers.totalRevenue);
router.get('/order/verify', OrderControllers.verifyPayment);

export const OrderRoutes = router;
