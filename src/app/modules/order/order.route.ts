import express from "express";
import { OrderControllers } from "./order.controller";


const router = express.Router();

router.post('/orders', OrderControllers.createOrder);

export const OrderRoutes = router;
