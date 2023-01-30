const changeToLogin = document.querySelector("#changeToLogin");
const changeToSignup = document.querySelector("#changeToSignup");
const loginElement = document.querySelector("#login");
const signupElemnt = document.querySelector("#signup");
const csrfElement = document.getElementsByName("csrfmiddlewaretoken");
const formName = document.querySelector(".formName");
const username = document.querySelector(".username");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const signupBtn = document.querySelector(".signup");
const loginBtn = document.querySelector(".login");
const background = document.querySelector(".background");

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
    userDataValidation(emailValue=email.value, passwordValue=password.value, btn=signupBtn, usernameValue=username.value)
    fetch("/members/signup/",{
        method:"POST",
        headers:{
            "X-CSRFToken": token
        },
        body:JSON.stringify(requestData)
    }).then(response => (response.json())).then(
        data => {
            if (data.ok){
                location.reload();
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
    userDataValidation(emailValue=emails.value, passwordValue=passwords.value, btn=loginBtn);
    fetch("/members/login/",{
        method:"POST",
        headers:{
            "X-CSRFToken": token
        },
        body:JSON.stringify(requestData)
    }).then(response => (response.json())).then(
        data => {
            // console.log(data)
            location.href = '/members/member_page/'
        }
    )
})

background.addEventListener("click", event => {
    const msg = document.querySelector(".msg");
    msg.remove();
    background.style.display = "none";
})

function userDataValidation(emailValue, passwordValue, btn, usernameValue = false){
    console.log(usernameValue)
    const msg = document.createElement("span");
    msg.className = "msg";
    if (usernameValue){
        let usernameRegrex = /^[a-zA-Z0-9._]{3,20}$/;
        let usernameIsValid = usernameRegrex.test(usernameValue);
        if(! usernameIsValid){
            msg.textContent = "請輸入usename";
            btn.insertAdjacentElement("afterend", msg);
            background.style.display = "block";
        }
    }

    let emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let emailIsValid = emailRegrex.test(emailValue);
    console.log(emailIsValid)
    let passwordRegrex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let passwordIsValid = passwordRegrex.test(passwordValue);
    console.log(passwordIsValid)
    if (! emailIsValid){
        msg.textContent = "請輸入email";
        btn.insertAdjacentElement("afterend", msg);
        background.style.display = "block";
    }else if (! passwordIsValid){
        msg.textContent = "請輸入密碼";
        btn.insertAdjacentElement("afterend", msg);
        background.style.display = "block";
    }

    return;
}