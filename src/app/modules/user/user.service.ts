import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

 const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const { name, email, password, phone, address, city} = data;

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

// export const deactivateUser = async (userId: string) => {


//   if (!Types.ObjectId.isValid(userId)) {
//     throw new Error('Invalid user ID');
//   }

//   const user = await User.findById(userId);


//   if (!user) {
//     throw {
//           statusCode: StatusCodes.UNAUTHORIZED,
//           message: "User not found",
//           error: { details: "User did not match" },
//         };
//   }

//   user.isActive = false;
//   await user.save();
// };

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

  user.isActive = isActive; // Update status dynamically
  await user.save();
};


export const UserServices = {
  registerUserIntoDB,
  loginUser,
 getAllUsers,
  // deactivateUser
  toggleUserStatus
}