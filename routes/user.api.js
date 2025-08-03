const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

// 1. 회원가입 endpoint
router.post('/', userController.createUser);
// 2. 토근 로그인 endpoint
router.get('/me', authController.authenticate, userController.getUser); // token이 valid한 값인지, token으로 user를 찾아서 리턴

module.exports = router;
