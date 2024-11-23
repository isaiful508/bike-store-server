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

// Get a specific product by ID

const getProductById = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      console.log(productId);
      const product = await ProductServices.getProductById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found', success: false });
      }
  
      res.status(200).json({ message: 'Bike retrieved successfully', success: true, data: product });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving bike', success: false, error });
    }
  };

// Update a product
const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const updates = req.body;
        const updatedProduct = await ProductServices.updateProduct(productId, updates);
        if (updatedProduct) {
            res.status(200).json({
                message: "Bike updated successfully",
                status: true,
                data: updatedProduct,
            });
        } else {
            res.status(404).json({
                message: "Bike not found",
                status: false,
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error updating bike",
            success: false,
            error,
        });
    }
};

// Delete a product
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await ProductServices.deleteProduct(productId);
        if (deletedProduct) {
            res.status(200).json({
                message: "Bike deleted successfully",
                status: true,
                data: deletedProduct,
            });
        } else {
            res.status(404).json({
                message: "Bike not found",
                status: false,
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error deleting bike",
            success: false,
            error,
        });
    }
};

export const ProductControllers = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}