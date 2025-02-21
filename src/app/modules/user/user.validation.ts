import { z } from 'zod';

export const registerValidationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["customer", "admin"]).default("customer"), // Ensures role is valid
  phone: z.string().optional(), // Optional field
  address: z.string().optional(), // Optional field
  city: z.string().optional(), // Optional field
});
  
  export const loginValidationSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  });