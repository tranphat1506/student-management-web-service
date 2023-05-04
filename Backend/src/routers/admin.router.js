const express = require('express');
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.post('/isAdmin', adminController.authCheck);

router.post('/send-code', adminController.sendCode);

router.post('/verify-code', adminController.verifyCode)

router.post('/verify-code-in-list', adminController.verifyCodeInList)

module.exports = router