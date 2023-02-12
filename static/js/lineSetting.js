const loginChannelId = document.querySelector("#login-channel-id")
const loginChannelSecret = document.querySelector("#login-channel-secret")
const button = document.querySelector(".btn")
const logout = document.querySelector("#logout");
const csrfElement = document.getElementsByName("csrfmiddlewaretoken");
const token = csrfElement[0].defaultValue;
let pathname = window.location.pathname;
let queryName = pathname.split("/")[3];

get_members_info();
showChannelData();

logout.addEventListener("click", event => {
  fetch("/members/logout/").then(
    resp => (resp.json())
  ).then(
    data => {
      if (data.ok){
        location.href = "/" ;
      }
    }
  )
})


function get_members_info(){
  fetch("/members/get_members_info/").then(
    resp => (resp.json())
  ).then(
    data => {
      if (data.data){
        membersData = data.data;
      }else{
        location.href = "/"
      }
    }
  )
}


button.addEventListener("click", event => {
    get_line_login_data();
})



function get_line_login_data(){
    let request_data = {
        "channelId": loginChannelId.value,
        "channelSecret": loginChannelSecret.value,
        "username": queryName
    }
    fetch("/line/channel/", {
        method: "POST",
        headers: {
            "X-CSRFToken": token
        },
        body: JSON.stringify(request_data)
    }).then(
        resp => (resp.json())
    ).then(
        data => {
            if (data.ok){
                location.reload();
            }
        }
    )

}

function showChannelData(){
    fetch("/line/show/",{
        method: "POST",
        body: JSON.stringify({"username": queryName})
    }).then(
        resp => (resp.json())
    ).then(
        data => {
            if (data.ok){
                loginChannelId.value = data.data.channel_id;
                loginChannelSecret.value = data.data.channel_secret;
                loginChannelId.setAttribute("disabled", "disabled");
                loginChannelSecret.setAttribute("disabled", "disabled");
                button.textContent = "已連動";
                button.setAttribute("disabled", "disabled");
            }
        })
}