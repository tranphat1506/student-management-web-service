const jwtHelper = require('../helpers/jwt.helper');
const _ = require('underscore');
const {UserModel} = require('../models/users.model');
const signupValidation = require('../helpers/signup.validation');
const {v4 : uuidv4} = require('uuid')
const {logEvents} = require("../middlewares/logEvents");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE
const bcrypt = require('bcrypt');
const saltRounds = 8;
const {roleDisplay} = require("../helpers/roledisplay.helpers")
const signIn = async (req, res)=>{
    const {user_name, password, remember_pwd} = req.body;
    try {
        const userWasFound = await UserModel.findOne({ "account_details.user_name": user_name})
        if (_.isNull(userWasFound))
            return res.status(400).json({
                message: 'Tài khoản hoặc mật khẩu không hợp lệ!'
            })
        if (!userWasFound.account_details.email.isVerify && !userWasFound.account_details.phone.isVerify)
            return res.status(400).json({
                message: 'Tài khoản này vẫn chưa xác thực!'
            })
        const passwordMatch = await bcrypt.compare(password, userWasFound.account_details.password);
        if (!passwordMatch)
            return res.status(400).json({
                message: 'Tài khoản hoặc mật khẩu không hợp lệ!'
            })

        Promise.all([
            jwtHelper.generateToken(userWasFound, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE), 
            jwtHelper.generateToken(userWasFound , REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE)
        ])
        .then(async arrayToken=>{
            // neu client muon luu tai khoan
            if (remember_pwd){
                res.cookie('a_token', arrayToken[0].encoded, {
                    maxAge : 3600000, // 1 hour
                    sameSite: 'none',
                    httpOnly : false,
                    secure : true
                })
                /* res.cookie('r_token', arrayToken[1].encoded, {
                    maxAge : 2678400000, // 31 days
                    sameSite: 'none',
                    httpOnly : false,
                    secure : true
                }) */
                return res.status(200).json({
                    code : 200,
                    r_token : arrayToken[1].encoded
                })
            }
            res.cookie('a_token', arrayToken[0].encoded, {
                sameSite: 'none',
                httpOnly : false,
                secure : true,
                path : '/'
            })
            return res.sendStatus(200); 
        })
    // Catch error
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}
const nodeMailer = require("../helpers/nodemailer.helpers.js")
const template = require("../helpers/email.template")
const verifyMethodList = 
{
    "email" : true,
    "phone" : false
}
const typeTrans = {'fname' : 0, 'lname' : 1,'dBirth' : 2, 'mBith' : 3, 'yBirth' : 4, 'role' : 5, 'sex' : 6, 'user_name' : 7, 'password' : 8, 're_password' : 9, 'phone' : 10, 'email' : 11, 'method' : 12}
const signUp = async (req, res)=>{
    const {fname , lname ,phone, email, user_name, password, re_password, method, dBirth, mBirth, yBirth, role, sex} = req.body;
    // Date of birth
    if(!dBirth){
        return res.status(400).json({
            message : "Vui lòng không bỏ trống ngày sinh!",
            type : typeTrans['dBirth']
        })
        
    }
    if(!mBirth){
        return res.status(400).json({
            message : "Vui lòng không bỏ trống tháng sinh!",
            type : typeTrans['mBirth']
        })
    }
    if(!yBirth){
        return res.status(400).json({
            message : "Vui lòng không bỏ trống năm sinh!",
            type : typeTrans['yBirth']
        })
    }
    const isLeap = ((yBirth % 4== 0 && yBirth % 100 !=0) || yBirth % 400 == 0 )
    if (mBirth == 2 && dBirth > 28){
        if(!isLeap || dBirth > 29 || dBirth<1){
            return res.status(400).json({
                message : `Ngày ${dBirth} không có trong tháng ${mBirth}. Vui lòng kiểm tra lại!`,
                type : typeTrans['dBirth']
            })
        }
    }
    switch (mBirth) {
        case 4:
        case 6:
        case 9:
        case 11:
            if(dBirth>30 || dBirth<1){
                return res.status(400).json({
                    message : `Ngày ${dBirth} không có trong tháng ${mBirth}. Vui lòng kiểm tra lại!`,
                    type : typeTrans['dBirth']
                }) 
            }        
        default:
            if(dBirth>31 || dBirth<1){
                return res.status(400).json({
                    message : `Ngày ${dBirth} không có trong tháng ${mBirth}. Vui lòng kiểm tra lại!`,
                    type : typeTrans['dBirth']
                })
            }
    }
    // 
    const errorValidation = signupValidation({
        fname,
        lname,
        birth : new Date(yBirth + "-" + mBirth + "-" + dBirth).toISOString(),
        role,
        sex,
        user_name,
        password,
        re_password,
        phone,
        email,
        method
    });
    if (errorValidation){
        return res.status(400).json({
            message : errorValidation.message,
            type : typeTrans[errorValidation.details[0].context.key]
        });
    }
    const role_display = roleDisplay(role);
    if (!role_display){
        return res.status(400).json({
            message : `Vai trò "${role}" không được hỗ trợ!`,
            type : typeTrans['role']
        })
    }
    // Method
    if (!verifyMethodList[method]){
        return res.status(400).json({
            message : `Phương thức xác thực bằng ${method} chưa có!`,
            type : typeTrans['method']
        })
    }
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds)
        const userInDB = await UserModel.findOne({ "account_details.user_name": user_name})
        if (_.isNull(userInDB)){
            // send verify code to device
            const code = await uuidv4();
            const html = template.sendVerifyCode("http://localhost/home",`http://localhost/auth?method=verify&token=${code}`,user_name)
            if (method == "email"){
                await nodeMailer.sendMail("gmail", req.body[method], "Xác Thực Tài Khoản Mới",html)
            }
            // save user info to data
            const id = await uuidv4();
            const newUser = new UserModel({
                id,
                account_details : {
                    user_name,
                    password : hashPassword,
                    email : {
                        details : email
                    },
                    phone : {
                        details : phone,
                    },
                    role : {
                        display : role_display
                    }
                },
                info_details : {
                    fullname : {
                        first_name : fname,
                        last_name : lname
                    },
                    birth : {
                        day : dBirth,
                        month : mBirth,
                        year : yBirth
                    },
                    sex : {
                        display : !sex ? "Nữ" : (sex>1 ? "Chưa cập nhật" : "Nam"),
                        info : sex
                    }
                },
                temp_data : {
                    email_verification_code : {
                        expired_at : new Date().getTime() + 86400000,   // 24 hours after created account
                        token : code
                    }
                }
            })
            await newUser.save();
            //send OK status
            return res.status(200).json({
                message : 'Đăng ký thành công!'
            })
        }
        // if already have account
        return res.status(400).json({
            message : 'Người dùng đã tồn tại!',
            type : typeTrans['user_name']
        })

    // Catch error
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(503).json({
            code : 503,
            message : 'Hệ thống đang bận!'
        });
    }
}

const signOut = (req, res)=>{
    console.log(req.cookies.a_token);
    res.clearCookie('a_token');
    return res.sendStatus(200);
}

const refreshAccessToken = async (req, res)=>{
    if (!req.headers.authorization && !req.cookies.r_token && !req.body.r_token ){
        // no token provided
        return res.status(403).json({
            code : 403,
            message : 'No token provided or token expired!'
        });
    }
    try {
        const r_token = req.cookies.r_token || req.headers.authorization.split(' ')[1] || req.body.r_token;
        const { decoded } = await jwtHelper.verifyToken(r_token, REFRESH_TOKEN_SECRET);
        const newAccessToken = await jwtHelper.generateToken(decoded, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
        res.cookie('a_token', newAccessToken.encoded, {
            maxAge : 3600000, // 1 hour
            sameSite: 'none',
            httpOnly : false,
            secure : true
        })
        return res.status(200).json({
            token : newAccessToken.encoded
        })
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(401).json({
            code : 401,
            message : 'Hệ thống đang bận!'
        });
    }
}
const emailVerify = async (req, res)=>{
    const token = req.body && req.body.token;
    if (!token){
        return res.status(400).json({
            code : 400,
            message : 'Bad Request.'
        });
    }
    try {
        const userInDB = await UserModel.findOne
        ({ 
            "temp_data.email_verification_code.token" : token
        })
        if (!userInDB){
            return res.status(403).json({
                code : 403,
                message : 'The verification link has expired!'
            });
        }
        const email = userInDB.account_details.email.details;
        // if user already verify email || token not the same
        const isExpired = (new Date().getTime() - Number(userInDB.temp_data.email_verification_code.expired_at)) > 0;
        if (userInDB.account_details.email.isVerify || isExpired){
            return res.status(403).json({
                code : 403,
                message : 'The verification link has expired!'
            });
        }
        userInDB.account_details.email.isVerify = true;
        await userInDB.save();
        return res.status(200).json({
            code : 200,
            message : "OK!",
            user_email : email
        })
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(503).json({
            code : 503,
            message : 'Hệ thống đang bận!'
        });
    }
}
const authCheck = (req,res)=>{
    if (!req.headers.authorization && !req.cookies.a_token && !req.body.a_token ){
        // no token provided
        return res.status(403).json({
            code : 403,
            message : 'No token provided or token expired!'
        });
    }
    const a_token = req.cookies.a_token || req.headers.authorization.split(' ')[1] || req.body.a_token;
    jwtHelper.verifyToken(a_token,ACCESS_TOKEN_SECRET)
    .then(()=>{
        return res.status(200).json({
            code : 200,
            message : 'Welcome back user!'
        })
    })
    .catch((error)=>{
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        console.log(req.cookies.a_token);
        res.clearCookie('test')
        res.clearCookie('a_token',{
            path : '/'
        }); // important
        return res.status(401).json({
            code : 401,
            message : 'No Authorized!'
        });
    })
}
module.exports = {
    signIn,
    signUp,
    signOut,
    emailVerify,
    refreshAccessToken,
    authCheck
}