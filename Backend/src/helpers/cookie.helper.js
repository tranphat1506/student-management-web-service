module.exports={
    removeCookie : function (res, cname, option = {}){
        if (!cname || !res) return false;
        option.maxAge = 1;
        return res.cookie(cname, '', option)
    }
}