const User = require('mongoose');
const UserSchema = new User.Schema({
    id : String,
    account_details : {
        user_name : String,
        password : String,
        role : {
            info : {type : String, default : 'client'}, // Only client or admin
            display : {type : String, default : 'Chưa cập nhật'} // Display a role to web
        },
        email : {
            isVerify : { type : Boolean, default : false},
            details : {type : String, default : 'Chưa cập nhật'}
        },
        phone : {
            isVerify : { type : Boolean, default : false},
            details : {type : String, default : 'Chưa cập nhật'},
        },
        created_at : { type : String, default : new Date().toISOString()}
    },
    info_details : {
        display_name : {type : String, default : 'Chưa cập nhật'},
        fullname : {
            first_name : String,
            last_name : String,
        },
        birth : {
            day : Number,
            month : Number,
            year : Number
        },
        sex : {
            display : {type : String, default: 'Chưa cập nhật'},
            info : Number
        },
        avatar_url : { type : String , default : 'https://cdn141.picsart.com/357697367045201.jpg'},
    },
    temp_data : {
        email_verification_code : {
            expired_at : String,
            token : String
        }
    }
})
const UserModel = User.model('Users',UserSchema);
module.exports = {
    UserModel
}