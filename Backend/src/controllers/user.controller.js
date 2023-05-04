const {getPayload} = require('../helpers/jwt.helper')
const userService = require('../services/user.service')
const getInfo = async (req, res)=>{
    // get what ?
    const a_token = getPayload(req.cookies.a_token || req.headers.authorization.split(' ')[1]).id
    const getID = (req.body && req.body.id) || a_token;
    // is permit to get this data
    userService.getUserDataFromID(a_token, getID, true)
    .then((user)=>{
        return res.status(200).json({user})
    })
    .catch((error)=>{
        process.env.NODE_ENV != 'development'
        ? logEvents(`${error.name}: ${error.message}`,`errors`)
        :   console.log(`${error.name}: ${error.message}`);
        return res.status(403).json({
            message : error.message
        });
    })
}

module.exports = {
    getInfo
}