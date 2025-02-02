export type IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
  }