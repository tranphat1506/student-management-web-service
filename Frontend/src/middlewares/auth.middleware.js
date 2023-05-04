const jwtHelper = require('../helpers/jwt.helper');
const _ = require('underscore');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const BE_URL = process.env.BE_URL;
const verifyToken = async (req, res, next)=>{
    const [url, __] = req.originalUrl.split('?')
    if (req.query.method === 'sign-out'){
        return next()
    }
    try {
        const a_token = req.cookies.a_token;
        const { decoded } = await jwtHelper.verifyToken(a_token, ACCESS_TOKEN_SECRET);
        if (url == '/auth'){
            return res.status(200).redirect('/')
        }
        next()
    } catch (error) {
        const redirect = req.query.redirect ? `&redirect=${req.query.redirect}` : (req.url == '/auth' ? '' : `&redirect=${req.url.split('?')[0]}`)
        res.clearCookie('a_token')
        if (!req.cookies.r_token){
            // no token provided
            if (url == '/auth'){
                return next()
            }
            return res.status(400).redirect('/auth?method=sign-in'+redirect)
        }
        const r_token = req.cookies.r_token
        fetch(BE_URL+'/api/auth/refresh-token',{
            method : 'POST',
            headers : {
                'Authorization' : 'Bearer ' + r_token
            }
        })
        .catch((error)=>{
            console.log(error);
            res.clearCookie('r_token')
            return res.status(400).redirect('/auth?method=sign-in'+redirect)
        })
        .then(async (response)=>{
            const json = await response.json()
                if (response.status >= 400 ){
                res.clearCookie('r_token')
                return res.status(400).redirect('/auth?method=sign-in'+redirect)
            }
            
            await res.cookie('a_token', json.token, {
                maxAge : 3600000, // 1 hour
                sameSite: 'none',
                httpOnly : true,
                secure : true
            })
            next()
        })
    }
}
const verifyAdmin = async (req, res, next)=>{
    if (!req.cookies.adminLogin){
        // no token provided
        if (req.originalUrl == '/admin/login'){
            return next()
        }
        return res.status(400).redirect('/admin/login')
    }
    try {
        const a_token = req.cookies.a_token;
        const data = { code : req.cookies.adminLogin }
        const response = await fetch(BE_URL+'/api/admin/verify-code-in-list',{
            method : 'POST',
            headers : {
                'Authorization' : 'Bearer ' + a_token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body : JSON.stringify(data)
        })
        if (response.status >= 400){
            return res.status(response.status).render('404page')
        }
        if (url == '/admin/login'){
            return res.redirect('/admin')
        }
        next()
    } catch (error) {
        res.clearCookie('adminLogin', {path : '/'})
        return res.status(400).redirect('/admin/login')
    }
}

module.exports = {
    verifyToken,
    verifyAdmin
}