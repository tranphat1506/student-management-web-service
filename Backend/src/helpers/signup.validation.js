const Joi = require('joi')
const minAge = new Date('1905-1-1').toISOString()
const maxAge = new Date(Date.now() - 315569259747).toISOString() // 11 years ago from now
const Regex = {
    email : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    password : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{8,}$/,
    phone : /(\+84|0)+([0-9]{9})\b/,
    user_name : /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{6,32}$/
}
const Message = {
    space : " ",
    required : "không được để trống!",
    min : "tối thiểu {{#limit}} ký tự!",
    max : "tối đa {{#limit}} ký tự!",
    pattern : "không hợp lệ!",
    empty : "không được để trống!",
    equal : "không trùng với mật khẩu vừa nhập!"
}
const Label = {
    fname : "Tên",
    lname : "Họ và tên đệm",
    user_name : "Tên tài khoản",
    password : "Mật khẩu",
    re_password : "Mật khẩu nhập lại",
    email : "Email",
    phone : "Số điện thoại",
    birth : "Tuổi của bạn",
    sex : "Giới tính",
    role : "Vai trò của bạn",
    method : "Phương thức xác thực"
}
const registerRule = Joi.object({
    fname: Joi.string()
        .required()
        .messages({
            "string.empty" : Label.fname + Message.space + Message.empty,
            "any.required" : Label.fname + Message.space + Message.required,
        }),
    lname: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty" : Label.lname + Message.space + Message.empty,
            "any.required" : Label.lname + Message.space + Message.required,
            "string.min" : Label.lname + Message.space + Message.min
        }),
    birth : Joi.date()
        .max(maxAge)
        .min(minAge)
        .iso()
        .required()
        .messages({
            "date.empty" : Label.birth + Message.space + Message.empty,
            "any.required" : Label.birth + Message.space + Message.required,
            "date.max" : Label.birth + Message.space + "phải tối thiểu là 11 tuổi!",
            "date.min" : Label.birth + Message.space + Message.pattern,
        }),
    role : Joi.string()
        .required()
        .messages({
            "string.empty" : Label.role + Message.space + Message.empty,
            "any.required" : Label.role + Message.space + Message.required,
        }),  
    sex : Joi.number()
        .required()
        .min(0)
        .max(1)
        .messages({
            "number.empty" : Label.sex + Message.space + Message.empty,
            "any.required" : Label.sex + Message.space + Message.required,
            "number.min" : Label.sex + Message.space + Message.pattern,
            "number.max" : Label.sex + Message.space + Message.pattern
        }),
    user_name: Joi.string()
        .min(6)
        .max(32)
        .pattern(Regex.user_name)
        .messages({
            "string.min" : Label.user_name + Message.space + Message.min,
            "string.empty" : Label.user_name + Message.space + Message.empty,
            "string.max" : Label.user_name + Message.space + Message.max,
            "string.pattern.base" : Label.user_name + Message.space + Message.pattern
        }),  
    password: Joi.string()
        .min(8)
        .pattern(Regex.password)
        .required()
        .messages({
            "any.required" : Label.password + Message.space + Message.required,
            "string.min" : Label.password + Message.space + Message.min,
            "string.empty" : Label.password + Message.space + Message.empty,
            "string.pattern.base" : Label.password + Message.space + Message.pattern
        }),
    re_password: Joi.string()
        .equal(Joi.ref('password'))
        .required()
        .messages({
            "any.required" : Label.re_password + Message.space + Message.required,
            "string.empty" : Label.re_password + Message.space + Message.empty,
            "any.only" : Label.re_password + Message.space + Message.equal
        }),
    phone : Joi.string()
        .required()
        .pattern(Regex.phone)
        .messages({
            "any.required" : Label.phone + Message.space + Message.required,
            "string.pattern.base" : Label.phone + Message.space + Message.pattern,
            "string.empty" : Label.phone + Message.space + Message.empty
        }),
    email : Joi.string()
        .pattern(Regex.email)
        .required()
        .messages({
            "any.required" : Label.email + Message.space + Message.required,
            "string.empty" : Label.email + Message.space + Message.empty,
            "string.pattern.base" : Label.email + Message.space + Message.pattern
        }),
    method : Joi.string()
        .required()
        .messages({
            "any.required" : Label.method + Message.space + Message.required,
            "string.empty" : Label.method + Message.space + Message.empty,
        }),
})
const updateEmailAndPhone = Joi.object({
    email : Joi.string()
        .pattern(Regex.email)
        .messages({
            "string.empty" : Label.email + Message.space + Message.empty,
            "string.pattern.base" : Label.email + Message.space + Message.pattern
        }),
    phone : Joi.string()
        .pattern(Regex.phone)
        .messages({
            "string.pattern.base" : Label.phone + Message.space + Message.pattern,
            "string.empty" : Label.phone + Message.space + Message.empty
        }),
})
module.exports = validation = (schema) =>{
    const { error } = registerRule.validate(schema)
    if (error) return error;
}
