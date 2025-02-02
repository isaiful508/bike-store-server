import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

 const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const { name, email, password } = data;
  const hashedPassword = await hashPassword(password!);

  const user = new User({ name, email, password: hashedPassword });
  return await user.save();
};

// export const loginUser = async (email: string, password: string): Promise<IUser | null> => {
//   const user = await User.findOne({ email });
//   if (!user || !(await comparePassword(password, user.password))) {
//     return null;
//   }
//   return user;
// };



export const UserServices = {
  registerUserIntoDB,
  // loginUser,
}