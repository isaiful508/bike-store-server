export type IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";
    phone?: string;
    address?: string;
    city?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }