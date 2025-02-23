
import config from '../../config';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/SendResponse';
import { UserServices } from './user.service';
import { loginValidationSchema, registerValidationSchema } from './user.validation';

const JWT_SECRET = config.jwt_secret as string;

const registerUser = catchAsync(async (req, res) => {
  const validatedData = registerValidationSchema.parse(req.body);

  const result = await UserServices.registerUserIntoDB(validatedData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});



export const loginUser = catchAsync(async (req, res) => {
  const validatedData = loginValidationSchema.parse(req.body);
  const user = await UserServices.loginUser(validatedData.email, validatedData.password);
  if (!user) {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "User not found",
      error: { details: "Email or password did not match" },
    };
  }


  const token = jwt.sign({ 
    id: user._id,
    email : user.email,
    name : user.name,
    role: user.role,
    phone : user.phone,
    address : user.address,
    city : user.city,
  }, JWT_SECRET, { expiresIn: '24h' });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: { token },
  });
});






export const UserControllers = {
  registerUser,
  loginUser,
};