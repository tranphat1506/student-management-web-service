const { UserModel } = require("../models/users.model");

const getUserDataFromID = async (id, idToGet, permission = false)=>{
    return new Promise((resolve, reject)=>{
        if (!permission){
            return reject({
                name : 'ERROR_CODE_403',
                status : 403,
                message : 'No permission!'
            }) // no permit to get
        }
        UserModel.findOne({idToGet})
        .then((data)=>{
            // if this is author account
            if (id === idToGet){
                return resolve({
                    status : 200,
                    message : {
                        fullname : data.info_details.fullname,
                        display_name : data.info_details.display_name,
                        sex : data.info_details.sex.display,
                        birth : data.info_details.birth,
                        avt_url : data.info_details.avatar_url,
                        phone : data.account_details.phone,
                        email : data.account_details.email,
                        user_name : data.account_details.user_name,
                        role : data.account_details.role.display
                    }
                })
            }
        })
        .catch((error)=>{
            return resolve(error);
        })
    })
}


module.exports = {
    getUserDataFromID
}