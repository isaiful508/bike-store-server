
import config from '../../config';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/SendResponse';
import { UserServices } from './user.service';
import { loginValidationSchema, registerValidationSchema } from './user.validation';
import { hashPassword } from './user.utils';
import bcrypt from 'bcrypt';

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


const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
})


export const toggleUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  await UserServices.toggleUserStatus(userId, isActive);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
  });
});


// const updateUser = catchAsync(async (req, res) => {
//   const userId = req.params.userId;
//   const body = req.body;

//   if (body.password) {
//     const hashedPassword = await hashPassword(body.password); 
//     body.password = hashedPassword;
//   }

//   const result = await UserServices.updateUser(userId, body);
//   console.log({result});

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'User updated successfully',
//     data: result,
//   });
// });


const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, password, ...updateFields } = req.body;

  // const user = await User.findById(userId);
  // if (!user) {
  //   throw {
  //     statusCode: StatusCodes.NOT_FOUND,
  //     message: "User not found",
  //     error: { details: "No user exists with this ID" },
  //   };
  // }

  // If the request contains a new password, verify the old password first
  if (password) {
    if (!oldPassword) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Old password is required to update password",
      };
    }

    // Compare old password with stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Old password did not match",
      };
    }

    // Hash the new password before updating
    updateFields.password = await hashPassword(password);
  }

  // Update the user
  const result = await UserServices.updateUser(userId, updateFields);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});


export const UserControllers = {
  registerUser,
  loginUser,
  getAllUsers,
  toggleUserStatus,
  updateUser
};