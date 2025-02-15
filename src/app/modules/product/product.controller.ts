import { Request, Response, NextFunction } from 'express';
import { ProductServices } from './product.service';
import { productValidationSchema} from './product.validation';

// Create a Product
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedProduct = productValidationSchema.parse(req.body.data);

    const result = await ProductServices.createProductIntoDB(validatedProduct);

    res.status(201).json({
      message: 'Product created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Products
const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.searchTerm as string | undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const brand = req.query.brand as string | undefined;
    const category = req.query.category as string | undefined;
    const inStock = req.query.inStock ? req.query.inStock === "true" : undefined;

    const products = await ProductServices.getAllProducts({
      searchTerm,
      minPrice,
      maxPrice,
      brand,
      category,
      inStock,
    });

    res.status(200).json({
      message: "Products retrieved successfully",
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
