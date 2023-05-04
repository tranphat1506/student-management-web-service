const express = require('express');
const router = express.Router();
const path = require('path')
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')
router.use(authMiddleware.verifyAdmin)
router.get('/login', adminController.loginPage);
router.get('/', adminController.mainPage);
module.exports = router;