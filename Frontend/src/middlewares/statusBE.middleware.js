const BE_STATUS_ENDPOINT = process.env.BE_URL ? process.env.BE_URL + '/status' : false;
const fetch2 = require('node-fetch');
function renderServerBusy(res, done_time = undefined){
    return res.status(500).render('notificationTemplate', {
        title : "🚧 Đang bảo trì",
        isError : false,
        errorCode : false,
        main_message: "🚀 HỆ THỐNG BẢO TRÌ",
        sub_message: !done_time
        ? '（>﹏<）Xin lỗi vì sự bất tiện này, chúng tôi sẽ hoàn thành đợt bảo trì sớm nhất có thể.'
        : '（>﹏<）Xin lỗi vì sự bất tiện này, chúng tôi sẽ bảo trì tới ' + done_time +'.'
    });
}
async function checking(req, res, next){
    if (!BE_STATUS_ENDPOINT){
        // LOG //
        console.log('Endpoint not found. Please check environment value!');
        return renderServerBusy(res)
    }
    try {
        const r = await fetch2(BE_STATUS_ENDPOINT, {

            method : 'GET'
        })
        if (r.status != 200){
            const {done_time} = await r.json();
            throw Error({message : "Server bảo trì!", done_time : done_time})
        }
        return next();
    } catch (error) {
        //console.log('BE server is busy!');
        console.log('ERROR>>',error);
        return renderServerBusy(res, error.done_time);
    }
}

module.exports = {checking};