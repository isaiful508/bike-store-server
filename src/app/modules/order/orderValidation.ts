import { z } from 'zod';

export const orderValidationSchema = z.object({
  user: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid user ID" }), // Assuming user is a valid ObjectId
  products: z.array(
    z.object({
      product: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid product ID" }), // Valid product ObjectId
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    })
  ).nonempty({ message: "At least one product is required" })
});
