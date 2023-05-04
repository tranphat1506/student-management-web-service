const {v4 : uuidv4} = require('uuid')
const nodeMailer = require('../helpers/nodemailer.helpers')
const jwtHelper = require('../helpers/jwt.helper');
const { UserModel } = require('../models/users.model')
const {logEvents} = require("../middlewares/logEvents");
const adminCode = {}
const codeVerify = {}
const timeToGetNextCode = 1000 * 60 * 10; // 10 minutes

const sendCode = async (req, res)=>{
    if (!req.headers.authorization && !req.cookies.a_token){
        // no token provided
        return res.status(401).json({
            message : 'Unauthorized!'
        });
    }
    try {
        const a_token = req.cookies.a_token || req.headers.authorization.split(' ')[1];
        const payload = jwtHelper.getPayload(a_token);
        const UserData = await UserModel.findOne({id : payload.id});
        const email = UserData.account_details.email;
        const CODE = uuidv4();
        const currentTime = new Date().getTime();
        // verify email
        if (!email.details && !email.isVerify){
            return res.status(403).json({
                message : 'Email was NOT in whitelist or NOT verify yet!'
            })
        }
        // if first time client get code
        if (!adminCode[email.details]){
            adminCode[email.details] = {
                code : CODE,
                turns : 4,
                last_get : currentTime // milliseconds
            }
        }    
        // if not first time client get code
        else{ 
            // check time to get next code
            // if current time is not the right time to get next code
            if (currentTime - adminCode[email.details].last_get < timeToGetNextCode){
                const time_left = Math.round((timeToGetNextCode - (currentTime - adminCode[email.details].last_get))/1000)
                return res.status(403).json({
                    time_left,
                    message : `Please wait ${time_left}s to get next verification code!`
                })
            }
            // if current time is the right time to get next code
            adminCode[email.details].last_get = currentTime;
            adminCode[email.details].code = CODE;
            adminCode[email.details].turns = 4;
        }
        // send email
        if (process.env.NODE_ENV !== 'development'){
            await nodeMailer.sendMail('gmail', email.details, 'Test', `<h1>${CODE}<h1>`);
            return res.status(200).json({
                message : 'Verification code was sent to your email!'
            })
        }
        console.log(`IP: ${req.socket.remoteAddress}`);
        console.log(`CODE : ${CODE}`);
        return res.status(200).json({
            message : 'Verification code was sent to your email!'
        })
        
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}

const verifyCode = async (req, res)=>{
    const codeInBody = req.body.code;
    // verify code
    if (!codeInBody){
        return res.status(403).json({
            message : 'Verification code should not be empty!'
        })
    }
    try {
        const a_token = req.cookies.a_token || req.headers.authorization.split(' ')[1];
        const payload = jwtHelper.getPayload(a_token);
        const UserData = await UserModel.findOne({id : payload.id});
        const email = UserData.account_details.email;
        // verify email
        if (!email.details && !email.isVerify){
            return res.status(403).json({
                message : 'Email was NOT in whitelist or NOT verify yet!'
            })
        }
        // check if code was not add to adminCode
        if (!adminCode[email.details]){
            return res.status(403).json({ message : 'Can not found email info in list!'})
        }
        // check if not enough turns
        if (!adminCode[email.details].turns){
            const currentTime = new Date().getTime();
            const time_left = Math.round((timeToGetNextCode - (currentTime - adminCode[email.details].last_get))/1000)
            return res.status(400).json({
                message : `Enter the wrong verification code too many times, please wait ${time_left}s and get new code!`
            })
        }
        // check if code was not correct
        if (adminCode[email.details].code !== codeInBody){
            adminCode[email.details].turns -= 1;
            adminCode[email.details].last_get = new Date().getTime();
            return res.status(403).json({
                message : `Verification code doesn't match, you only have ${adminCode[email.details].turns} entries left`
            })
        }
        // correct code
        
        res.cookie('adminLogin', codeInBody, {
            secure : true
        })
        codeVerify[codeInBody] = {
            email : email.details,
            time_access : new Date()
        }
        delete adminCode[email.details];
        return res.status(200).json({
            message : 'Success login to admin page!'
        })
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}

const verifyCodeInList = (req,res)=>{
    const code = req.body.code;
    if (!codeVerify[code]){
        return res.status(404).json({
            code : 404,
            message : 'Code was wrong or delete by Admin!'
        })
    }
    return res.status(200).json({
        code : 200,
        message : 'OK'
    })
}

const authCheck = (req,res) =>{
    return res.status(200).json({
        code : 200,
        message : 'OK'
    })
}
module.exports = {
    sendCode,
    verifyCode,
    verifyCodeInList,
    authCheck
}