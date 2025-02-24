import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "customer"], default: "customer" },
        isActive: { type: Boolean, default: true },
        phone: { type: String, required: false },
        address: { type: String, required: false },
        city: { type: String, required: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const User = model<IUser>('User', userSchema);
