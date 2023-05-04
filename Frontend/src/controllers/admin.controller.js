

const mainPage = (req, res)=>{
    return res.render('./admin/home');
}

const loginPage = (req, res)=>{
    return res.render('./admin/login');
}
const noPermission = (req, res)=>{
    return res.render('404page')
}
module.exports = {
    mainPage,
    loginPage
}