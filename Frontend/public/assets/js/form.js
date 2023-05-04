const inputElements = ['#fname-input','#lname-input', '#dBirth-input','#mBirth-input','#yBirth-input', '#role-select','#sex-choice','#username-input','#new-password-input','#re-password-input','#tel-input','#email-input','#device-verify']
function loading(buttonElement, text = '', type = 1){
    buttonElement.textContent = text;
    if (!type)
        return !document.querySelector(".loader") ? false : document.querySelector(".loader").remove();
    const loader = document.createElement("div");
    loader.classList.add("loader");
    return buttonElement.appendChild(loader)
}
function createNewMessage(message, type = 0, f = 0){
    const typeList = ["message--error", "message--success", "message--normal"]
    const errorMessage = document.querySelector(f ? "#login_form .error-message" : "#register_form .error-message");
    errorMessage.innerHTML = ""
    const tag = document.createElement("p");
    tag.classList.add(typeList[type])
    tag.textContent = message;
    errorMessage.append(tag)
    return 1;
}
function warningMessageForInput(inputElementId, type, message = '', removeValue = 0, f = 0){
    const typeOfWarn = ['input--normal', 'input--success', 'input--error']
    const e = document.querySelector(f ?`#login_form ${inputElementId}` : `#register_form ${inputElementId}`)
    removeValue ? e.value = "" : false;
    !message == '' ? e.setAttribute('placeholder', message) : false;
    if (!type && e.classList.contains(typeOfWarn[type]))
    {
        // return to normal input
        return e.classList.replace(typeOfWarn[type],typeOfWarn[0]);
    }
    return e.classList.replace(typeOfWarn[0],typeOfWarn[type]);
}
async function dangnhap(){
    const loginURL = 'https://apiuwuservice.onrender.com/api/auth/signin';
    const FORM = document.querySelector("#login_form");
    const USERNAME = FORM.querySelector("#username-input");
    const PASSWORD = FORM.querySelector("#password-input");
    const REMEMBER_PWD = document.querySelector("#remember-password")
    const redirect = !!window.location.href.split("redirect=")[1] ? window.location.href.split("redirect=")[1] : ''
    if (!USERNAME || !USERNAME.value)
    {
        const message = "Tên đăng nhập không hợp lệ !"
        return warningMessageForInput('#username-input',2, message,1,1)
    }
    if (!PASSWORD || !PASSWORD.value)
    {
        const message = "Mật khẩu không hợp lệ !"
        return warningMessageForInput('#password-input',2, message,1,1)
    }
    const data = {
        user_name : USERNAME.value,
        password : PASSWORD.value,
        remember_pwd : REMEMBER_PWD.checked
    }
    loading(FORM.querySelector(".btn-sign-in"))
    try {
        const APIResponse  = await fetch(loginURL, {
            method : 'POST',
            credentials : 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body : JSON.stringify(data)
        });
        if (APIResponse.status >= 400){
            loading(FORM.querySelector(".btn-sign-in"),'Đăng nhập',0);
            const {message} = await APIResponse.json()
            warningMessageForInput('#username-input',2, message||'',1,1)
            warningMessageForInput('#password-input',2, message||'',1,1)
            return;
        }
        if (REMEMBER_PWD.checked){
            const {r_token} = await APIResponse.json()
            window.localStorage.setItem("rToken", r_token)
        }
        return window.location.replace(redirect)
    } catch (error) {
        loading(FORM.querySelector(".btn-sign-in"),'Đăng nhập',0);
        return window.location.reload()
    }
}
function redirectSignUp(){
    return window.location.href = `/auth?method=sign-up&redirect=${window.location.pathname}`
}
function redirectSignIn(){
    return window.location.href = `/auth?method=sign-in&redirect=${window.location.pathname}`
}
function redirectHome(){
    return window.location.href = '/home'
}
function SignIn(){
    document.querySelector("#password-input").addEventListener("keyup",function (e){
        const showPassword_input = document.querySelector(".inside-card > .show-password");
        if (showPassword_input.classList.contains('undisplay')){
            return showPassword_input.classList.remove('undisplay');
        }
    })
    document.querySelector(".inside-card #show-password").addEventListener("change",function(e){
        const password_input = document.querySelector("#password-input")
        if (password_input.attributes.type.nodeValue == "password"){
            return document.querySelector("#password-input").setAttribute('type', 'text');
        }
        return document.querySelector("#password-input").setAttribute('type', 'password');
    })
}
function updateProgress(){
    const bars = document.querySelectorAll(".progress-bar")
    const texts = document.querySelectorAll(".progress-title")
    const progress = document.querySelectorAll(".progress")
    for (const e of bars) {
        if (!e.classList.contains("progress-bar--done")){
            e.classList.add("progress-bar--done");
            break;
        }
    }
    for (const e of progress) {
        if (!e.classList.contains("progress--done")){
            e.classList.add("progress--done");
            if (!e.classList.contains("finish-label")){
                e.nextElementSibling.classList.add("progress-bar--done");
            }
            break;
        }
    }
    for (const e of texts) {
        if (!e.classList.contains("progress-title--done")){
            e.classList.add("progress-title--done");
            break;
        }
    }
}
function backProgress(i){
    const bars = document.querySelectorAll(".progress-bar")
    const texts = document.querySelectorAll(".progress-title")
    const progress = document.querySelectorAll(".progress")
    if (bars[i*2]) bars[i*2].classList.remove("progress-bar--done");
    bars[i*2-1].classList.remove("progress-bar--done");
    progress[i].classList.remove("progress--done");
    texts[i].classList.remove("progress-title--done");
    return i-1;
}
async function dangky(){
    if (!next()){
        return 0;
    }
    const FORM = document.querySelector("#register_form")
    const icon = FORM.querySelector(".form-close-btn")
    icon ? icon.classList.remove("back-transform") : false
    icon.setAttribute('onclick', 'redirectHome()')
    const infoCard = FORM.querySelector(".info-card")
    const accountCard = FORM.querySelector(".account-card")
    const verifyCard = FORM.querySelector(".verify-card")

    const firstName_Input = infoCard.querySelector("#fname-input")
    const lastName_Input = infoCard.querySelector("#lname-input")
    const dBirth_Input = infoCard.querySelector("#dBirth-input")
    const mBirth_Input = infoCard.querySelector("#mBirth-input")
    const yBirth_Input = infoCard.querySelector("#yBirth-input")
    const sexChoice = infoCard.querySelector("input[name=sex-choice]:checked")
    const roleSelect_Input = infoCard.querySelector("#role-select")

    const username_Input = accountCard.querySelector("#username-input")
    const password_Input = accountCard.querySelector("#new-password-input")
    const rePassword_Input = accountCard.querySelector("#re-password-input")
    const tel_Input = accountCard.querySelector("#tel-input")
    const email_Input = accountCard.querySelector("#email-input")

    const deviceSelect_Input = verifyCard.querySelector("#device-verify");
    const registerUrl = 'https://apiuwuservice.onrender.com/api/auth/signup'
    async function displayAll(){
        verifyCard.classList.remove("undisplay");
        infoCard.classList.remove("undisplay");
        accountCard.classList.remove("undisplay");
        [infoCard, accountCard].forEach(element => {
            element.querySelector(".btn-sign-up").style.display = "none";
        });
        verifyCard.querySelector(".btn-sign-up").style.display = "block"
        verifyCard.querySelector(".btn-sign-up").setAttribute("onclick", "dangky()");
    }
    async function unDisplayAll(){
        verifyCard.classList.add("undisplay");
        infoCard.classList.add("undisplay");
        accountCard.classList.add("undisplay");
        [infoCard, accountCard, verifyCard].forEach(element => {
            element.querySelector(".btn-sign-up").style.display = "none";
        });
    }
    const data = {
        fname: firstName_Input.value,
        lname: lastName_Input.value,
        dBirth : dBirth_Input.value,
        mBirth : mBirth_Input.value, 
        yBirth : yBirth_Input.value,
        role : roleSelect_Input.value,
        sex : sexChoice.value,
        user_name: username_Input.value,
        password: password_Input.value,
        re_password: rePassword_Input.value,
        phone : tel_Input.value,
        email : email_Input.value,
        method : deviceSelect_Input.value
    }
    await unDisplayAll()
    loading(FORM.querySelector("#register_form .error-message"));
    try {
        const APIResponse  = await fetch(registerUrl, {
            method : 'POST',
            credentials : 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body : JSON.stringify(data)
        });
        if (APIResponse.status >= 400){
            FORM.style.overflowY = 'auto'
            FORM.style.height = '80vh'
            loading(FORM.querySelector("#register_form .error-message"), '', 0);
            await displayAll();
            const {message, type} = await APIResponse.json();
            if (type && type!=2 || type ==0) warningMessageForInput(inputElements[type],2,'',1,0);
            return createNewMessage(message);
        }
        await unDisplayAll()
        createNewMessage("Đăng ký thành công (UwU), vui lòng kiểm tra email để xác nhận!",1)
        return updateProgress();
    } catch (error) {
        FORM.style.overflowY = 'auto'
        FORM.style.height = '80vh'
        //console.log(error);
        await displayAll();
        return createNewMessage("Hệ thống đang bận ;O; Vui lòng thử lại sau vài phút!")
    }

}
function back() {
    const FORM = document.querySelector("#register_form")
    const cards = FORM.querySelectorAll(".inside-card")
    const icon = FORM.querySelector(".form-close-btn")
    for (i = 0; i < cards.length; i++) {
        if (!cards[i].classList.contains("undisplay")){
            if (i>3 || i <= 0 || !cards[i]){
                return blurOff();
            }
            let current_card = cards[i]
            let back_card = cards[i-1]
            if (i ==1 || i>=3|| !cards[i]){
                icon.classList.remove("back-transform")
                icon.setAttribute('onclick', 'redirectHome()')
            }
            backProgress(i);
            current_card.classList.add('undisplay')
            return back_card.classList.remove('undisplay')
        }
    }
    return 1;
}
function next(){
    const FORM = document.querySelector("#register_form")
    const icon = FORM.querySelector(".form-close-btn")
    const infoCard = FORM.querySelector(".info-card")
    const accountCard = FORM.querySelector(".account-card")
    const verifyCard = FORM.querySelector(".verify-card")
    const errorMessage = FORM.querySelector(".error-message");
    errorMessage.innerHTML = ""
    const displayList = [infoCard.classList.contains("undisplay") || false,
                        accountCard.classList.contains("undisplay") || false,
                        verifyCard.classList.contains("undisplay") || false]
    if (!displayList[0] && !displayList[1] && !displayList[2]){
        return 1;
    }
    if (!displayList[0]){
        // change icon
        if (icon){
            icon.classList.add("back-transform")
            icon.setAttribute('onclick', 'back()')
        }
        const firstName_Input = infoCard.querySelector("#fname-input")
        const lastName_Input = infoCard.querySelector("#lname-input")
        const dBirth_Input = infoCard.querySelector("#dBirth-input")
        const mBirth_Input = infoCard.querySelector("#mBirth-input")
        const yBirth_Input = infoCard.querySelector("#yBirth-input")
        const sexChoice = infoCard.querySelector("input[name=sex-choice]:checked")
        const roleSelect_Input = infoCard.querySelector("#role-select")

        const displayNameRegExp = /^(?![- '])(?![×Þß÷þø])[- '0-9A-Za-zÀ-ÛaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+(?<![- ']).{4,24}$/
        if (!firstName_Input.value.split(' ').length == 1 || firstName_Input.value.trim() == ''){
            firstName_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Hãy nhập tên hợp lệ!")
            return 0;
        }
        if(!lastName_Input.value.match(displayNameRegExp)){
            lastName_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Hãy nhập họ và tên đệm hợp lệ!")
            return 0;
        }
        if(!dBirth_Input.value){
            dBirth_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Vui lòng không bỏ trống ngày sinh!")
            return 0;
        }
        if(!mBirth_Input.value){
            mBirth_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Vui lòng không bỏ trống tháng sinh!")
            return 0;
        }
        if(!yBirth_Input.value){
            yBirth_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Vui lòng không bỏ trống năm sinh!")
            return 0;
        }
        const isLeap = ((yBirth_Input.value % 4== 0 && yBirth_Input.value % 100 !=0) || yBirth_Input.value % 400 == 0 )
        if (mBirth_Input.value == 2 && dBirth_Input.value > 28){
            if(!isLeap || dBirth_Input.value > 29 || dBirth_Input.value<1){
                dBirth_Input.classList.replace("input--normal", "input--error")
                createNewMessage(`Ngày ${dBirth_Input.value} không có trong tháng ${mBirth_Input.value}. Vui lòng kiểm tra lại!`)
                return 0;
            }
        }
        switch (mBirth_Input) {
            case 4:
            case 6:
            case 9:
            case 11:
                if(dBirth_Input.value>30 || dBirth_Input.value<1){
                    dBirth_Input.classList.replace("input--normal", "input--error")
                    createNewMessage(`Ngày ${dBirth_Input.value} không có trong tháng ${mBirth_Input.value}. Vui lòng kiểm tra lại!`)   
                    return 0;
                }
                break;
            default:
                if(dBirth_Input.value>31 || dBirth_Input.value<1){
                    dBirth_Input.classList.replace("input--normal", "input--error")
                    createNewMessage(`Ngày ${dBirth_Input.value} không có trong tháng ${mBirth_Input.value}. Vui lòng kiểm tra lại!`)
                    return 0;
                }
        }
        if (roleSelect_Input.value === "default"){
            roleSelect_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Vui lòng chọn vai trò bạn muốn đăng ký!")
            return 0;
        }
        if (!sexChoice){
            createNewMessage("Vui lòng chọn giới tính!")
            return 0;
        }
        // success
        infoCard.classList.add("undisplay");
        accountCard.classList.remove("undisplay");
        updateProgress();
        return 0;
    }
    if (!displayList[1]){
        const username_Input = accountCard.querySelector("#username-input")
        const password_Input = accountCard.querySelector("#new-password-input")
        const rePassword_Input = accountCard.querySelector("#re-password-input")
        const tel_Input = accountCard.querySelector("#tel-input")
        const email_Input = accountCard.querySelector("#email-input")
        const tel_regex = /(\+84|0)+([0-9]{9})\b/g
        const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const username_regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{6,32}$/igm
        const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{8,}$/
        if (!username_Input.value.match(username_regex)){
            username_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Tên người dùng không hợp lệ!")
            return 0;
        }
        if (!password_Input.value.match(password_regex)){
            password_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Mật khẩu vui lòng nhập có ít nhất 1 ký tự in hoa, 1 ký tự đặc biệt và từ 8 ký tự trở lên!")
            return 0;
        }
        if (!(password_Input.value === rePassword_Input.value)){
            rePassword_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Hai mật khẩu không trùng khớp!")
            return 0;
        }
        const countryCode = '+84'
        if (!`${countryCode}${tel_Input.value}`.match(tel_regex)){
            tel_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Số điện thoại không hợp lệ!")
            return 0;
        }
        if (!email_Input.value.match(email_regex)){
            email_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Email không hợp lệ!")
            return 0;
        }
        // sucess
        accountCard.classList.add("undisplay");
        verifyCard.classList.remove("undisplay");
        updateProgress();
        return 0;
    }
    if (!displayList[2]){
        const deviceSelect_Input = verifyCard.querySelector("#device-verify");
        if (deviceSelect_Input.value === "default"){
            deviceSelect_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Vui lòng chọn phương thức xác minh!")
            return 0;
        }
        if (deviceSelect_Input.value === "phone"){
            deviceSelect_Input.classList.replace("input--normal", "input--error")
            createNewMessage("Xin lỗi, hiện hệ thống không nhận xác minh bằng sđt!")
            return 0;
        }
        verifyCard.classList.add("undisplay");
        return 1;
    }

}
function SignUp(){
    document.querySelectorAll(".inside-card input").forEach(e=>{
        e.addEventListener("click",()=>{
            e.classList.replace("input--error", "input--normal")
            return;
        })
    })
    document.querySelectorAll(".inside-card select").forEach(e=>{
        e.addEventListener("click",()=>{
            e.classList.replace("input--error", "input--normal")
            return;
        })
    })
    const FORM = document.querySelector("#register_form")
    const infoCard = FORM.querySelector(".info-card")
    const dBirth_Input = infoCard.querySelector("#dBirth-input")
    const mBirth_Input = infoCard.querySelector("#mBirth-input")
    const yBirth_Input = infoCard.querySelector("#yBirth-input")
    const maxDate = new Date(Date.now() - 315569259747).toISOString().split('T')[0].split('-')

    function createOption(selectElement, value, text = value, select = false){
        const e = document.createElement("option")
        e.setAttribute("value", value)
        e.textContent = text;
        if (select) e.selected = true;
        return selectElement.appendChild(e);
    }
    function createDateOptions(selectElement, min, max, selectValue){
        for (let i = min; i <= max; i++) {
            if (i == selectValue)
                createOption(selectElement, i, i, true);
            else
                createOption(selectElement, i);
        }
        return 1;
    }
    createDateOptions(dBirth_Input, 1, 31, maxDate[2]);
    createDateOptions(mBirth_Input, 1, 12, maxDate[1]);
    createDateOptions(yBirth_Input, maxDate[0] - 118, maxDate[0], maxDate[0]);
}
function init(){if(document.querySelector("#register_form"))SignUp();else if(document.querySelector("#login_form")){SignIn()}};init();
