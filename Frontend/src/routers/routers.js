const express = require('express');
const path = require('path');
const authMiddleware = require('../middlewares/auth.middleware')
const statusMiddleware= require('../middlewares/statusBE.middleware')
const router = express.Router();

// status route
router.get('/status', (req, res)=>{
    return res.status(200).render('notificationTemplate', {
        title : "Trạng thái server",
        isError : false,
        errorCode : false,
        main_message: "UwU HỆ THỐNG ĐANG CHẠY NGON LÀNH!",
        sub_message: 'Lần cập nhật cuối: ' + _STATUS_TIME
    });
})
// check BE is running
router.use(statusMiddleware.checking);

// home routers
const homeRouter = require("./home.router");
router.use('/', homeRouter);

//router.use(authMiddleware.verifyToken)
// auth routers
const authRouter = require('./auth.router')
router.use('/auth', authRouter);
//admin routers
const adminRouter = require('./admin.router');
router.use('/admin', adminRouter);

// 404 page
router.get('/*', (req,res)=>{
    return res.render('notificationTemplate', {
        title : "o-O! Có gì đó sai sai",
        isError : true,
        errorCode : 404,
        main_message: "ERROR 404: KHÔNG THỂ TÌM THẤY TRANG",
        sub_message: 'Xin lỗi chúng tôi không thể tìm thấy trang mà bạn cần. Có thể nội dung đã bị xóa.'
    });
})
module.exports = router;