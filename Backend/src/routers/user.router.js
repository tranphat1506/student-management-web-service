const express = require('express')
const router = express.Router();
const userController = require('../controllers/user.controller');

// get user info
router.post('/', userController.getInfo)

module.exports = router