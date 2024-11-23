import { Request, Response } from "express";
import Product from "./product.model";
import { ProductServices } from "./product.service";


const createProduct = async (req: Request, res: Response) => {

    try {
        const product = req.body;
        const result = await ProductServices.createProductIntoDB(product);
        res.status(200).json({
            message: "Bike created successfully",
            success: true,
            data: result 
        });

    } catch (error) {
        res.status(400).json({ message: "Error creating bike", success: false, error });
    }
}

export const ProductControllers = {
    createProduct
}