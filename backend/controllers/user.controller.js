import User from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';

export const createUserController = async (req, res) => {
    // Debug: Log the request body
    console.log('Request body received:', req.body);
    console.log('Individual fields:', {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const user = await userService.createUser(name, email, password);
        const token = user.generateAuthToken();
        delete user._doc.password;
        return res.status(201).json({ user, token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await userService.loginUser(email, password);
        const token = user.generateAuthToken();
        delete user._doc.password;
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};