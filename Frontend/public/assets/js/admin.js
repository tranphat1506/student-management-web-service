const baseURL = 'https://apiuwuservice.onrender.com'
async function sendcode(){
    function warningMessageForInput(inputElementId, type, message = ''){
        const typeOfWarn = ['input--normal', 'input--success', 'input--error']
        const e = document.querySelector(`${inputElementId}`)
        e.value = "";
        e.setAttribute('placeholder', message);
        if (!type && e.classList.contains(typeOfWarn[type]))
        {
            // return to normal input
            return e.classList.replace(typeOfWarn[type],typeOfWarn[0]);
        }
        return e.classList.replace(typeOfWarn[0],typeOfWarn[type]);
    }
    const sendCodeURL = baseURL + '/api/admin/send-code';
    const FORM = document.querySelector("#login_form");
    const codeInputLabel = FORM.querySelector(".adminCode-label");
    const sendCodeBtn = FORM.querySelector(".send-code");
    const verifyCodeBtn = FORM.querySelector(".verify-code");
    const codeInput = FORM.querySelector('#adminCode-input')
    const APIResponse  = await fetch(sendCodeURL, {
        method : 'POST',
        credentials : 'include',
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const json = await APIResponse.json()
    if (APIResponse.status >= 400){
        if (APIResponse.status == 401){
            return window.location.reload()
        }
        codeInput.value = ""
        codeInput.setAttribute('placeholder', json.message)
        codeInput.classList.contains('input--normal')
        ? codeInput.classList.replace('input--normal', 'input--error') : false 
    }else {
        codeInput.setAttribute('placeholder', json.message)
        codeInput.classList.contains('input--error')
        ? codeInput.classList.replace('input--error', 'input--normal') : false
    }
    verifyCodeBtn.style.display = "block"
    codeInputLabel.style.display = "inline-flex"
    sendCodeBtn.textContent = 'Gửi lại mã xác nhận'
}
async function verifycode(){
    const sendCodeURL = baseURL + '/api/admin/verify-code';
    const FORM = document.querySelector("#login_form");
    const codeInputLabel = FORM.querySelector(".adminCode-label");
    const sendCodeBtn = FORM.querySelector(".send-code");
    const verifyCodeBtn = FORM.querySelector(".verify-code");
    const codeInput = FORM.querySelector('#adminCode-input')
    const errorMessage = FORM.querySelector(".error-message p");
    if (codeInput.value.trim() === ''){
        codeInput.setAttribute('placeholder', 'Mã xác nhận');
        errorMessage.classList.contains('message--normal')
        ? errorMessage.classList.replace('message--normal', 'message--error') : false 
        return errorMessage.textContent = 'Không để trống mã xác nhận!'
    }
    try {
        const APIResponse  = await fetch(sendCodeURL, {
            method : 'POST',
            credentials : 'include',
            headers : {
                "Content-type": "application/json; charset=UTF-8"
            },
            body : JSON.stringify({ code : codeInput.value})
        });
        const json = await APIResponse.json()
        if (APIResponse.status >=400){
            codeInput.setAttribute('placeholder', 'Mã xác nhận');
            codeInput.value = ""
            errorMessage.classList.contains('message--normal')
            ? errorMessage.classList.replace('message--normal', 'message--error') : false 
            errorMessage.textContent = json.message
            return ;
        }
        return window.location.reload()
    } catch (error) {
        return window.location.reload()
    }
}
