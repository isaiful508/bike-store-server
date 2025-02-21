import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';

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
  return user;
};



export const UserServices = {
  registerUserIntoDB,
  loginUser,
}