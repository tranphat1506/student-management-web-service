var currentMenuOpen = {
    srcElement : undefined,
    wrapperElement : undefined
};
function darkmodeOn(b = 1) {
    const isOn = localStorage.getItem('darkmode');
    if (b) {
        if (document.body.classList.contains("darkmode--on")){
            document.body.classList.remove("darkmode--on")
            localStorage.removeItem('darkmode')
            document.documentElement.setAttribute(
                "data-color-scheme", "light"
            );
            return 1;
        }
        document.documentElement.setAttribute(
            "data-color-scheme","dark"
        );
        document.body.classList.add("darkmode--on")
        localStorage.setItem('darkmode',1)
        return 1;
    }
    document.documentElement.setAttribute(
        "data-color-scheme",
        isOn  ? "dark" : "light"
    );
    isOn
     ? document.body.classList.add("darkmode--on")
     : document.body.classList.remove("darkmode--on")
    return 0;
}
function scroll(x,y,mX = 0, mY = 0){
    return window.scrollTo({left: x-mX, top: y - mY, behavior : 'smooth'})
}
function moveToTop() {
    return window.scrollTo({top: 0, behavior: 'smooth'});
}
function timeDisplay(t){
    setInterval(function(){
        document.querySelectorAll(".time-display").forEach(e => {
            e.textContent = new Date().toLocaleString();
        });
    },t)
}
function blurOn(t = 0){
    const b = document.querySelector(t ? ".blur-bg:has(#register_form)" : ".blur-bg:has(#login_form)")
    b.classList.toggle('blur--on')
    b.addEventListener('click',function (e){
        if (e.target == this){
            removeEventListener('click',this)
            return blurOff()
        }
    })
    document.body.classList.toggle('scroll-lock')
    return 1;
}
function blurOff(){
    const b = document.querySelectorAll(".blur--on")
    b.forEach(function(e){
        e.classList.remove('blur--on')
    })
    document.body.classList.remove('scroll-lock')
    return 1;
}

class WelcomeTitle{
    #index;
    #messageList;
    constructor() {
        this.#index = 0;
        this.#messageList = ['FINCO - Hệ thống thi trắc nghiệm và quản lý học sinh.', new Date().toLocaleString()];
    }
    appendMessage(message){
        if (typeof message == typeof []){
            return this.#messageList.push(...message)
        }
        return this.#messageList.push(message);
    }
    // METHOD
    show(){
        document.querySelector(".title--main").textContent = this.#messageList[this.#index];
        this.#index++;
        if (this.#index >= this.#messageList.length){
            this.#index = 0;
        }
    }
}
function setCookie(cname, cvalue, exMins) {
    var d = new Date();
    d.setTime(d.getTime() + (exMins*60*1000));
    var expires = "expires="+d.toUTCString();  
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function removeCookie(name) {
    return setCookie(name,'',0);
}
function logout() {
    removeCookie('a_token');
    window.localStorage.removeItem('rToken');
    return 1;
}
function wrapperOpen(id=0, src = undefined) {
    const wrapperList = [['#setting-wrapper','BottomBarSetting'],]
    const wrapperById = document.querySelector(wrapperList[id][0]) || false
    if (!wrapperById) return -1;
    wrapperById.classList.toggle("wrapper-open");
    if (!wrapperList[id][1]) return 0;// if not need responsive
    Responsive[wrapperList[id][1]]();
    updateCurrentMenuOpen(src, wrapperById);
    return 1;
}
const Responsive = {
    outOfMaxDeviceWidth : function (eWidth){
        if (eWidth >= document.documentElement.clientWidth)
            return 1;
        return 0;
    }
    ,
    BottomBarSetting : function () {
        const settingButton = document.querySelector('.bottom-bar .main-setting');
        const settingWrapper = document.querySelector('#setting-wrapper');
        if (!settingButton || !settingWrapper) return -1;
        const buttonSize = 30;
        const sWWidth = settingWrapper.clientWidth;
        const sB_X = Math.floor(settingButton.getBoundingClientRect().x +buttonSize - sWWidth);
        //console.log(sWWidth);
        if (sB_X <= 0){
            settingWrapper.classList.toggle('fullscreen-wrapper');
            settingWrapper.style = ''
            return 0;
        }; // if out of width
        settingWrapper.style.left = sB_X + 'px';
        return 1;
    }
}
darkmodeOn(0)
function App(){
    function getCurrentUser(key) {
        return !window.localStorage.auth ? `{${key}}` : JSON.parse(window.localStorage.auth).currentUser[key]
    }
    function timeDisplay(t){
        setInterval(function(){
            document.querySelectorAll(".time-display").forEach(e => {
                e.textContent = new Date().toLocaleString();
            });
        },t)
    }
    document.querySelector(".btn--sign-up")?.addEventListener('click', function (e){
        blurOn(1)
        SignUp()
    })
    document.querySelector(".btn--sign-in")?.addEventListener('click', function (e){
        blurOn(0)
        SignIn()
    })
    timeDisplay(1000)
    var welcomeTitle = new WelcomeTitle();
    setInterval(function (){
        welcomeTitle.show();
    },5000) 
}
function updateCurrentMenuOpen(srcE, wrapE) {
    currentMenuOpen.srcElement = srcE;
    currentMenuOpen.wrapperElement = wrapE;
    return 1;
}
window.onclick= function(e){
    if (currentMenuOpen.srcElement != undefined){
        if (!currentMenuOpen.srcElement.contains(e.target)
        && !currentMenuOpen.wrapperElement.contains(e.target))
        {
            currentMenuOpen.wrapperElement.classList.toggle('wrapper-open');
            currentMenuOpen = {
                srcElement : undefined,
                wrapperElement : undefined
            };
        }
    }

}