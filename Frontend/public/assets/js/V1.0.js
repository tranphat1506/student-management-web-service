const renderElement = {
    header : ()=>{
        const url = 'http://localhost/header';
        return fetch(url,{
            method : 'POST',
        })
    }
}
const fetchList = {
    userDisplayInfo : function () {
        const url = 'https://apiuwuservice.onrender.com/api/user';
        return fetch(url,{
            method : 'POST',
            credentials : 'include',
            headers : {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    },
    isLogin : function (){
        const url = "https://apiuwuservice.onrender.com/api/auth/isLogin"
        return fetch(url,{
            method : 'POST',
            credentials : 'include',
            headers : {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    },
    isAdmin : function (){
        const url = "https://apiuwuservice.onrender.com/api/admin/isAdmin"
        return new Promise(function (resolve, reject){
            fetch(url,{
                method : 'POST',
                credentials : 'include',
                headers : {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(function (r){
                if (r.status >=400){
                    return reject(false)
                }
                return resolve(true)
            })
            .catch(function(){
                return reject(false)
            })
        })
    },
    refreshToken : function () {
        const url = 'https://apiuwuservice.onrender.com/api/auth/refresh-token';
        const r_token = window.localStorage.getItem('rToken') || false
        return new Promise(function (resolve, reject){
            if (!r_token) return reject('No refresh token!')
            return resolve(fetch(url,{
                method : 'POST',
                credentials : 'include',
                headers : {
                    'Authorization' : 'Bearer ' + r_token,
                    "Content-type": "application/json; charset=UTF-8"
                }
            }))
        })

    }
}
fetchList.isLogin()
.then(function (r){
    if(r.status == 403){
        throw Error("Authorized fail!")
    }
    if (r.status == 401){
        //removeCookie('a_token');
        fetchList.refreshToken().catch(function(){
            window.location.href = `/auth?method=sign-in&redirect=${window.location.pathname}`
        })
    }
    const paths = window.location.pathname.split('/')
    switch (paths[1]){
        case ('auth'):
            const redirectCondition = window.location.search.split('redirect=')[1] == 'auth'
            window.location.replace(!redirectCondition ? 'home' : window.location.search.split('redirect=')[1])
            break;
        case ('home'):
        case ('homepage'):
            header()
            break;
        default :
            break;
    }
})
.catch(function (error){
    //console.log(error);
    const paths = window.location.pathname.split('/')
    switch (paths[1]){
        case ('auth'):
        case ('home'):
        case ('homepage'):
            console.log(paths[1]);
            return 0;
        default :
            window.location.href = `/auth?method=sign-in&redirect=${window.location.pathname}`
            return 1;
    }
})
function header(){
    fetchList.userDisplayInfo()
    .then(function (r){
        if (r.status >= 400){
            if(r.status == 401){
                fetchList.refreshToken().then(function(){
                    return header();
                })
            }
            throw Error({
                status : 'fail',
                message : ''
            });
        }
        r.json().then((i)=>{
            window.localStorage.setItem("auth",JSON.stringify({ currentUser : i.user.message}))
            renderElement.header()
            .then(function(r){
                r.text().then(function(e){
                    document.querySelector("#header").innerHTML = e;
                    const header = document.querySelector("#header")
                    header.querySelector(".header__avatar").setAttribute("href" , "#/user/"+i.user.message.user_name)
                    header.querySelector(".avatar__img img").setAttribute("src", i.user.message.avt_url)
                    header.querySelector(".avatar__title").textContent = `${i.user.message.fullname.last_name} ${i.user.message.fullname.first_name}`
                })
            })
        })
    })
    .catch((e)=>{
        console.log(e);
    })
}
