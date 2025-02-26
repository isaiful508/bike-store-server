import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const { name, email, password, phone, address, city } = data;

  const hashedPassword = await hashPassword(password!);

  const user = new User({ name, email, password: hashedPassword, phone, address, city });
  return await user.save();
};

export const loginUser = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return null;
  }
  // Check if the user is deactivated
  if (user.isActive === false) {
    throw {
      statusCode: StatusCodes.FORBIDDEN,
      message: "User is deactivated",
      error: { details: "This account has been deactivated. Please contact support." },
    };
  }
  return user;
};

const getAllUsers = async () => {
  const result = await User.find()
  return result
}

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: "User not found",
      error: { details: "User ID did not match any records" },
    };
  }

  user.isActive = isActive;
  await user.save();
};

const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true, 
    runValidators: true,  // Ensures validation rules are applied
  });

  return result;
};


export const UserServices = {
  registerUserIntoDB,
  loginUser,
  getAllUsers,
  toggleUserStatus,
  updateUser
}