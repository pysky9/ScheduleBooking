const changeToLogin = document.querySelector("#changeToLogin");
const changeToSignup = document.querySelector("#changeToSignup");
const loginElement = document.querySelector("#login");
const signupElemnt = document.querySelector("#signup");
const csrfElement = document.getElementsByName("csrfmiddlewaretoken");
const formName = document.querySelectorAll(".formName");
const username = document.querySelector(".username");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const signupBtn = document.querySelector(".signup");
const loginBtn = document.querySelector(".login");
const background = document.querySelector(".background");
const signupLoading = document.querySelector("#signup-loading");
const loginLoading = document.querySelector("#login-loading");

changeToLogin.addEventListener("click", event =>{
    loginElement.style.display = "block";
    signupElemnt.style.display = "none";
})

changeToSignup.addEventListener("click", event =>{
    loginElement.style.display = "none";
    signupElemnt.style.display = "block";
})

signupBtn.addEventListener("click", event => {
    const username = document.querySelector(".username");
    const email = document.querySelector(".email");
    const password = document.querySelector(".password");
    const token = csrfElement[0].defaultValue;
    let requestData = {
        "username": `${username.value}`,
        "email": `${email.value}`,
        "password": `${password.value}`
    }
    if(userDataNotValidation(emailValue=email.value, passwordValue=password.value, btn=signupBtn, formTitle=formName[0].textContent, usernameValue=username.value)) return;
    signupBtn.style.display = "none";
    signupLoading.style.display = "block";
    fetch("/members/signup/",{
        method:"POST",
        headers:{
            "X-CSRFToken": token
        },
        body:JSON.stringify(requestData)
    }).then(response => (response.json())).then(
        data => {

            if (data.ok){
                const msg = document.createElement("span");
                msg.className = "msg";
                msg.textContent = "註冊成功";
                signupBtn.insertAdjacentElement("afterend", msg);
                background.style.display = "block";
                // close loading
                signupBtn.style.display = "block";
                signupBtn.setAttribute("disabled", "disabled");
                signupLoading.style.display = "none";
                // location.reload();
                setTimeout(() => {
                    loginElement.style.display = "block";
                    signupElemnt.style.display = "none";
                }, 1000);
            }
        }
    )

})


loginBtn.addEventListener("click", event => {
    const emails = document.querySelector("#inputEmail4");
    const passwords = document.querySelector("#inputPassword4");
    const token = csrfElement[0].defaultValue;
    let requestData = {
        "email": `${emails.value}`,
        "password": `${passwords.value}`
    }
    if(userDataNotValidation(emailValue=emails.value, passwordValue=passwords.value, btn=loginBtn, formTitle=formName[1].textContent)) return;
    
    loginBtn.style.display = "none";
    loginLoading.style.display = "block";

    fetch("/members/login/",{
        method:"POST",
        headers:{
            "X-CSRFToken": token
        },
        body:JSON.stringify(requestData)
    }).then(response => (response.json())).then(
        data => {
            if (data.ok){
                const msg = document.createElement("span");
                msg.className = "msg";
                msg.textContent = "登入成功";
                loginBtn.insertAdjacentElement("afterend", msg);
                background.style.display = "block";
                loginBtn.style.display = "block";
                loginBtn.setAttribute("disabled", "disabled");
                loginLoading.style.display = "none";
                setTimeout(() => {
                    // location.href = `/members/member_page/${data.username}`;
                    location.href = `/members/sitemap/${data.username}`
                }, 1000);
                
                
            }else{
                location.href = "/"
            }
            
        }
    )
})

background.addEventListener("click", event => {
    const msg = document.querySelector(".msg");
    msg.remove();
    background.style.display = "none";
})

function userDataNotValidation(emailValue, passwordValue, btn, formTitle, usernameValue = false){
    const msg = document.createElement("span");
    msg.className = "msg";
    if (formTitle === "商家註冊"){
        let usernameRegrex = /^[a-zA-Z0-9._]{3,20}$/;
        let usernameIsValid = usernameRegrex.test(usernameValue);
        if(! usernameIsValid){
            msg.textContent = "請輸入usename";
            btn.insertAdjacentElement("afterend", msg);
            background.style.display = "block";
            return true;}
    }

    let emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let emailIsValid = emailRegrex.test(emailValue);

    let passwordRegrex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    let passwordIsValid = passwordRegrex.test(passwordValue);

    if (! emailIsValid){
        msg.textContent = "請輸入email";
        btn.insertAdjacentElement("afterend", msg);
        background.style.display = "block";
        return true;
    }else if (! passwordIsValid){
        msg.textContent = "請輸入密碼";
        btn.insertAdjacentElement("afterend", msg);
        background.style.display = "block";
        return true;
    }
}
