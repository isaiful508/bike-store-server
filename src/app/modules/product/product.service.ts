import { Product } from "./product.interface";
import ProductModel from "./product.model";

//create product
const createProductIntoDB = async (product: Product) => {
    const result = await ProductModel.create(product);
    return result;
}

//get all products
const getAllProducts = async ( { searchTerm, minPrice, maxPrice, brand, category, inStock }: {
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    category?: string;
    inStock?: boolean;
} ) => {
    // eslint-disable-next-line
    let query: any = {};
   
    if (searchTerm) {
        query.$or = [
            { name: new RegExp(searchTerm, 'i') },
            { brand: new RegExp(searchTerm, 'i') },
            { category: new RegExp(searchTerm, 'i') },
        ];
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
    }

    if (brand) {
        query.brand = new RegExp(brand, 'i');
    }

    if (category) {
        query.category = new RegExp(category, 'i');
    }

    if (inStock !== undefined) {
        query.inStock = inStock;
    }

    const products = await ProductModel.find(query);
    return products;
};

// Get a specific product by ID
const getProductById = async (productId: string) => {

    const product = await ProductModel.findById(productId);
    
    return product;
};

// Update a product
const updateProduct = async (productId: string, updates: Partial<Product>) => {

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updates, {
        new: true,
    });

    return updatedProduct;

};

// Delete a product
const deleteProduct = async (productId: string) => {

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    return deletedProduct;

};

export const ProductServices = {
    createProductIntoDB,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct

}