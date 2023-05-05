const BE_URL = process.env.BE_URL;
const loginPage = async (req, res)=>{
    const redirect = req.query.redirect ? `&redirect=${req.query.redirect}` : ''
    switch (req.query.method) {
// --------------------------------------------------------------------------------            
        // Login endpoint
        case 'sign-in':
            return res.render('login');
// --------------------------------------------------------------------------------            
        // Register endpoint
        case 'sign-up':
            return res.render('register');
// --------------------------------------------------------------------------------            
        // Sign out endpoint
        case 'sign-out':
            res.clearCookie('a_token');
            res.clearCookie('r_token');
// --------------------------------------------------------------------------------            
        case 'verify':
            const token = req.query.token || false;
            if (!token){return res.status(400).redirect('/auth?method=sign-in')}
            try {
                const response = await fetch(BE_URL+'/api/auth/verify-email',{
                    method : 'POST',
                    headers : {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body : JSON.stringify({token})
                })
                if (response.status >= 400){
                    return res.status(404).render('notificationTemplate', {
                        title : "o-O! Có gì đó sai sai",
                        isError : true,
                        errorCode : 404,
                        main_message: "ERROR 404: KHÔNG THỂ TÌM THẤY TRANG",
                        sub_message: 'Xin lỗi chúng tôi không thể tìm thấy trang mà bạn cần. Có thể nội dung đã bị xóa.'
                    });
                }
                const json = await response.json()
                return res.status(200).render('emailVerifyDone',{
                    userEmail : json.user_email
                })
            } catch (error) {
                return res.status(400).redirect('/auth?method=sign-in')
            }
// --------------------------------------------------------------------------------            
        // After endpoint has no return || no query in request then this default
        // will redirect to login page
        default:
            return res.redirect('/auth?method=sign-in'+redirect);
    }
}

module.exports = {
    loginPage
}