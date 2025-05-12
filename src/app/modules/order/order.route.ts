import express from "express";
import { OrderControllers } from "./order.controller";


const router = express.Router();

router.post('/create-order', OrderControllers.createOrder);

router.get('/orders/revenue', OrderControllers.totalRevenue);
router.get('/order/verify', OrderControllers.verifyPayment);
router.get('/orders', OrderControllers.getAllOrders);

export const OrderRoutes = router;