import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { registerValidationSchema } from './user.validation';



const router = express.Router();

router.post(
    '/auth/register',
    validateRequest(registerValidationSchema),
    UserControllers.registerUser);



export const UserRoutes = router;