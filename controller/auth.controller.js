const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const authController = {};
const secretKey = process.env.JWT_SECRET_KEY;

authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }, '-createdAt -updatedAt -__v');
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = user.generateToken();
                return res.status(200).json({ status: 'success', user, token });
            }
        }
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
        console.error('Error in loginWithEmail:', err);
    }
};

authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new Error('Token nat found');
        }
        const token = tokenString.replace('Bearer ', '');
        jwt.verify(token, secretKey, (error, payload) => {
            if (error) {
                throw new Error('invalid token');
            }
            req.userId = payload._id;
        });
        next();
    } catch (err) {
        return res.status(400).json({ status: 'fail', message: err.message });
    }
};

module.exports = authController;
