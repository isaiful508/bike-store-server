import express from "express";
import { OrderControllers } from "./order.controller";


const router = express.Router();

router.post('/orders', OrderControllers.createOrder);

router.get('/orders/revenue', OrderControllers.totalRevenue);

export const OrderRoutes = router;
