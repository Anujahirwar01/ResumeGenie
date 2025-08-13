import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import {body} from 'express-validator';
import authUser from '../middlewares/authUser.middleware.js';
const router = Router();

router.post('/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    
    userController.createUserController
)

router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    userController.loginUserController
)

export default router;
