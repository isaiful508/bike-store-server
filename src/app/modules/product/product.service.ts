import { Product } from "./product.interface";
import ProductModel from "./product.model";

//create product
const createProductIntoDB = async (product: Product) => {
    const result = await ProductModel.create(product);
    return result;
}

//get all products
const getAllProducts = async (searchTerm?: string) => {
    let query = {};
    if (searchTerm) {
        query = {
            $or: [
                { name: new RegExp(searchTerm, "i") },
                { brand: new RegExp(searchTerm, "i") },
                { category: new RegExp(searchTerm, "i") },
            ],
        };
    }

    const products = await ProductModel.find(query);
    return products;
};

export const ProductServices = {
    createProductIntoDB,
    getAllProducts

}