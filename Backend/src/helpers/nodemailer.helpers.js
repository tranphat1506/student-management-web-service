const nodemailer = require('nodemailer');
const GMAIL = process.env.GMAIL
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

const createConfig = (service, email, password)=>{
    return {
        service,
        auth : {
            user : email,
            pass : password
        }
    }
}
const sendMail = (service, userEmail, subject = '', html = '') =>{
    let config;
    if (service == 'gmail'){
        config = createConfig(service, GMAIL, GMAIL_PASSWORD);
    }
    const transport = nodemailer.createTransport(config);
    const message = {
        from : config.auth.user,
        to : userEmail,
        subject,
        html
    }
    return transport.sendMail(message);
}


module.exports = {
    createConfig,
    sendMail
}