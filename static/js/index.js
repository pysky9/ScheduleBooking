const loginSign = document.querySelectorAll("#btn-literal");


loginSign.forEach(btn => {
    btn.addEventListener("click", event => {
        location.href = "/members/loginSignup/";
    })
})