let pathname = window.location.pathname;
let queryName = pathname.split("/")[3];

loginWithLine();

// 串接Line login
function loginWithLine() {
    fetch(`/line/data/${queryName}`).then(
        resp => (resp.json())
    ).then(
        data => {

            let url = data.redirect_uri + queryName;

            let clientId = data.clientID;
            let lineLoginUrl = "https://access.line.me/oauth2/v2.1/authorize?" +
              "response_type=code&" +
              "client_id=" + clientId + "&" +
              "redirect_uri=" + url + "&" +
              "scope=profile%20openid%20email%20phone&" +
              "state="+ data.state + "&" +
              "bot_prompt=normal&" +
              "nonce=09876zyxwv";
          
            window.location.replace(lineLoginUrl);
        }
    )

  
  }
  