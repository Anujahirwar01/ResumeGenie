import User from '../models/user.model.js';

export const createUser = async (name, email, password) => {
    if(!name || !email || !password) {
        throw new Error('All fields are required');
    }
    const hashedPassword = await User.hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    return await user.save();
}

export const loginUser = async (email, password) => {
    if(!email || !password) {
        throw new Error('Email and password are required');
    }
    const user = await User.findOne({ email }).select('+password');
    if(!user) {
        throw new Error('Invalid email or password');
    }
    const isValidPassword = await user.isValidPassword(password);
    if(!isValidPassword) {
        throw new Error('Invalid email or password');
    }
    return user;
}