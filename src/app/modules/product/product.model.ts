import mongoose, { Schema} from 'mongoose';
import { Product } from './product.interface';


const productSchema = new Schema<Product>( {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand : {
      type : String,
      required : true,
      trim: true
    },
    category: {
      type: String,
      enum: ["Mountain", "Road", "Hybrid", "Electric"],
      required: true,
    },
    description : {
      type : String,
      required : true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be a positive number"],
    },
    inStock: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
  
)


  
  const ProductModel = mongoose.model<Product>("Product", productSchema);

  export default ProductModel;