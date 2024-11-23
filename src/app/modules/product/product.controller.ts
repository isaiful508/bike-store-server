import { Request, Response } from "express";
import { ProductServices } from "./product.service";


const createProduct = async (req: Request, res: Response) => {

    try {
        const product = req.body.data;
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


// Get all products
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.searchTerm as string;
        const products = await ProductServices.getAllProducts(searchTerm);
        res.status(200).json({
            message: "Bikes retrieved successfully",
            status: true,
            data: products,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error retrieving bikes",
            success: false,
            error,
        });
    }
};



export const ProductControllers = {
    createProduct,
    getAllProducts
}