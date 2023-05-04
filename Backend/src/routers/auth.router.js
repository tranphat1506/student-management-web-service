const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/',(req,res)=>{
    return res.sendStatus(200);
});

router.post('/isLogin', authController.authCheck);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

router.post('/verify-email', authController.emailVerify);

router.post('/logout',authController.signOut);

module.exports = router;