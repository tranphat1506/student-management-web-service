const jwtHelper = require('../helpers/jwt.helper');
const _ = require('underscore');
const {logEvents} = require("./logEvents");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

const verifyToken = async (req, res, next)=>{
    if (!req.headers.authorization && !req.cookies.a_token){
        // no token provided
        return res.status(403).json({
            message : 'No token provided or token expired!'
        });
    }
    try {
        const a_token = req.cookies.a_token || req.headers.authorization.split(' ')[1];
        const { decoded } = await jwtHelper.verifyToken(a_token, ACCESS_TOKEN_SECRET);
        next()
    } catch (error) {
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(401).json({
            message : 'No token provided or token expired!'
        });
    }
}

module.exports = {
    verifyToken
}