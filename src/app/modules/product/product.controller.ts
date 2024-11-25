// import { Request, Response } from "express";
// import { ProductServices } from "./product.service";
// import { productValidationSchema } from "./product.validation";


// const createProduct = async (req: Request, res: Response) => {

//     try {
//         const product = req.body.data;
//         //validate with zod 
//         const zodParsedData = productValidationSchema.parse(product)

//         const result = await ProductServices.createProductIntoDB(zodParsedData);
//         res.status(200).json({
//             message: "Bike created successfully",
//             success: true,
//             data: result 
//         });

//     } catch (error) {
//         res.status(400).json({ message: "Error creating bike", success: false, error });
//     }
// }


// // Get all products
// const getAllProducts = async (req: Request, res: Response) => {
//     try {
//         const searchTerm = req.query.searchTerm as string;
//         const products = await ProductServices.getAllProducts(searchTerm);
//         res.status(200).json({
//             message: "Bikes retrieved successfully",
//             status: true,
//             data: products,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Error retrieving bikes",
//             success: false,
//             error,
//         });
//     }
// };

// // Get a specific product by ID

// const getProductById = async (req: Request, res: Response) => {
//     try {
//       const { productId } = req.params;
//       console.log(productId);
//       const product = await ProductServices.getProductById(productId);
  
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found', success: false });
//       }
  
//       res.status(200).json({ message: 'Bike retrieved successfully', success: true, data: product });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving bike', success: false, error });
//     }
//   };

// // Update a product
// const updateProduct = async (req: Request, res: Response) => {
//     try {
//         const productId = req.params.productId;
//         const updates = req.body;
//         const updatedProduct = await ProductServices.updateProduct(productId, updates);
//         if (updatedProduct) {
//             res.status(200).json({
//                 message: "Bike updated successfully",
//                 status: true,
//                 data: updatedProduct,
//             });
//         } else {
//             res.status(404).json({
//                 message: "Bike not found",
//                 status: false,
//             });
//         }
//     } catch (error) {
//         res.status(400).json({
//             message: "Error updating bike",
//             success: false,
//             error,
//         });
//     }
// };

// // Delete a product
// const deleteProduct = async (req: Request, res: Response) => {
//     try {
//         const productId = req.params.productId;
//         const deletedProduct = await ProductServices.deleteProduct(productId);
//         if (deletedProduct) {
//             res.status(200).json({
//                 message: "Bike deleted successfully",
//                 status: true,
//                 data: deletedProduct,
//             });
//         } else {
//             res.status(404).json({
//                 message: "Bike not found",
//                 status: false,
//             });
//         }
//     } catch (error) {
//         res.status(400).json({
//             message: "Error deleting bike",
//             success: false,
//             error,
//         });
//     }
// };

// export const ProductControllers = {
//     createProduct,
//     getAllProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct
// }


import { Request, Response, NextFunction } from 'express';
import { ProductServices } from './product.service';
import { productValidationSchema} from './product.validation'; // Import Zod schemas

// Create a Product
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the incoming product data using Zod schema
    const validatedProduct = productValidationSchema.parse(req.body.data);

    // Call the service to create the product
    const result = await ProductServices.createProductIntoDB(validatedProduct);

    // Respond with the created product
    res.status(201).json({
      message: 'Product created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    // Pass validation or other errors to error middleware
    next(error);
  }
};

// Get all Products
const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.searchTerm as string;

    // Call the service to get products
    const products = await ProductServices.getAllProducts(searchTerm);

    res.status(200).json({
      message: 'Products retrieved successfully',
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific Product by ID
const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    // Call the service to get the product by ID
    const product = await ProductServices.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update a Product
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the incoming update data using Zod schema (partial validation for updates)
    const validatedUpdates = productValidationSchema.parse(req.body);

    const updatedProduct = await ProductServices.updateProduct(
      req.params.productId,
      validatedUpdates
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a Product
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;

    // Call the service to delete the product by ID
    const deletedProduct = await ProductServices.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Product not found',
        success: false,
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      success: true,
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
