const navBatElement = document.querySelector("#navbar");
const contentElement = document.querySelector("#content");
const customerInformation = document.querySelector("#customer-infomation");
const payButton = document.querySelector(".pay");
const background = document.querySelector(".background");
const cardBody = document.querySelector("#credit-card-info");
const loading = document.querySelector("#loading");
const payLoading = document.querySelector("#pay-loading");
const orderDelete = document.querySelector(".order-delete");
let totalPrice = 0;
let pathname = window.location.pathname;
let orderId = pathname.split("/")[3];

get_order();

function get_order(){
    fetch(`/order/get_order_record/${orderId}`).then(
        response => (response.json())
    ).then(
        data =>{
            if (data.ok){
                render_order_record(orderId, data.order_data);
                loading.style.display = "none";
            }

        }
    )
}

orderDelete.addEventListener("click", event => {
    loading.style.display = "block";
    fetch("/order/delete_order/", {
        method: "POST",
        body: JSON.stringify({orderId: orderId})
    }).then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                redirectHomePage();
                loading.style.display = "none";
            }
        }
    )
})

function render_order_record(orderId, orderData){
    const titleContainer = document.createElement("div");
    titleContainer.className = "container";
    titleContainer.id = "order-title";
    titleContainer.textContent = `訂單資訊(編號：${orderId})`;

    customerInformation.insertAdjacentElement("beforebegin",titleContainer);

    orderData.forEach(order => {
        const containerElement = document.createElement("div");
        containerElement.className = "container";
        containerElement.id = "order-information";
    
        const cardContainer = document.createElement("div");
        cardContainer.className = "card";
        cardContainer.style.width = "30rem";
    
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
    
        const numberElement = document.createElement("p");
        numberElement.className = "card-text";
        numberElement.textContent = `預約編號：${order.bookings_id}`;
        cardBody.appendChild(numberElement);

        const dateElement = document.createElement("p");
        dateElement.className = "card-text";
        dateElement.textContent = `預約日期：${order.order_date}`
        cardBody.appendChild(dateElement);

        const timeElement = document.createElement("p");
        timeElement.className = "card-text";
        timeElement.textContent = `預約時段：${order.order_time}`;
        cardBody.appendChild(timeElement);

        const totalTimeElement = document.createElement("p");
        totalTimeElement.className = "card-text";
        totalTimeElement.textContent = `預約時長：${order.order_total_time}`;
        cardBody.appendChild(totalTimeElement);

        const priceElement = document.createElement("p");
        priceElement.className = "card-text";
        priceElement.textContent = `預約價格：${order.order_price}`;
        cardBody.appendChild(priceElement);
    
        cardContainer.appendChild(cardBody);
        containerElement.appendChild(cardContainer);
        customerInformation.insertAdjacentElement("beforebegin", containerElement);

        totalPrice += Number(order.order_price);
    })
    const totalPriceElement = document.createElement("div");
    totalPriceElement.className = "container";
    totalPriceElement.id = "total-price";
    totalPriceElement.textContent = `總費用為：${totalPrice}`;
    customerInformation.insertAdjacentElement("beforebegin", totalPriceElement);
}

// 金流
tappaySetting()

function tappaySetting(){
    fetch("/order/get_tappay_id_key/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                let tappayData = data.data;
                TPDirect.setupSDK(tappayData.app_id, tappayData.app_key, "sandbox");
                TPDirectCardSetup();
                TPDirect.ccv.setupCardType(TPDirect.CardType.VISA);
                TPDirect.ccv.setupCardType(TPDirect.CardType.JCB);
                TPDirect.ccv.setupCardType(TPDirect.CardType.AMEX);
                TPDirect.ccv.setupCardType(TPDirect.CardType.MASTERCARD);
                TPDirect.ccv.setupCardType(TPDirect.CardType.UNIONPAY);
                TPDirect.ccv.setupCardType(TPDirect.CardType.UNKNOWN);
            }
        }
    )
}

payButton.addEventListener("click",orderSubmit);

// -- 填寫欄位設定 -- //
function TPDirectCardSetup(){
    TPDirect.card.setup({
        fields: {
            number: {
                // css selector
                element: '#card-number',
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                // DOM object
                element: '#card-expiration-date',
                placeholder: 'MM / YY'
            },
            ccv: {
                element: '#card-ccv',
                placeholder: 'ccv'
            }
        },
        styles: {
            // Style all elements
            'input': {
                'color': 'gray'
            },
            // Styling ccv field
            'input.ccv': {
                'font-size': '16px'
            },
            // Styling expiration-date field
            'input.expiration-date': {
                'font-size': '16px'
            },
            // Styling card-number field
            'input.card-number': {
                'font-size': '16px'
            },
            // style focus state
            ':focus': {
                'color': 'black'
            },
            // style valid state
            '.valid': {
                'color': 'green'
            },
            // style invalid state
            '.invalid': {
                'color': 'red'
            },
            // Media queries
            // Note that these apply to the iframe, not the root window.
            '@media screen and (max-width: 400px)': {
                'input': {
                    'color': 'orange'
                }
            }
        },
        // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
            beginIndex: 6,
            endIndex: 11
        }
    })
}

// -- 點擊"確認訂購並付款"的回應 -- //
function orderSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        // 判斷哪個欄位錯誤 回應給使用者
        let message;
        if (tappayStatus.status.number === 1){
            message = "卡號欄位還沒有填寫";
        }else if (tappayStatus.status.number === 2){
            message = "卡號欄位有錯誤";
        }else if (tappayStatus.status.expiry === 1){
            message = "逾期時間欄位還沒有填寫";
        }else if (tappayStatus.status.expiry === 2){
            message = "逾期時間欄位有錯誤";
        }else if (tappayStatus.status.ccv === 1){
            message = "驗證密碼欄位還沒有填寫";
        }else {
            message = "驗證密碼欄位有錯誤";
        }
        errorMessageBox(message);
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        prime = result.card.prime;
        sentToServer(prime);
    })
}

// -- 付款資料送後端 -- //
function sentToServer(parameter){
    const phoneNumberElement = document.querySelector("#phoneNumber");
    const nameElement = document.querySelector("#staticName");
    const mailElement = document.querySelector("#staticEmail");
    const prime = parameter;
    let phone = phoneNumberElement.value;
    let name = nameElement.value;
    let mail = mailElement.value; 
    
    if (!phone){
        errorMessageforPhone("請輸入電話，謝謝。");
        return;
    }
    requestData = {
        "prime": prime,
        "order": {
            "price": totalPrice,
            "orderId": orderId
        },
        "contact": {
            "name": name,
            "email": mail,
            "phone": phone
        }
    }
    payLoading.style.display = "block";
    payButton.style.display = "none";
    fetch("/order/tappay_payment/",{
        method: "POST",
        body: JSON.stringify(requestData)
    }).then((response) => (response.json())).then(
        (responseData) => {
            let paymentMessage = responseData.data.data.payment.message;
            payLoading.style.display = "none";
            payButton.style.display = "block";
            payButton.setAttribute("disabled", "disabled");
            
            if(paymentMessage === "付款成功"){
                location.replace(`/order/complete_order_payment/${responseData.data.data.number}`);
            }else{
                errorMessageBox("付款失敗");
            }
        }
    )
} 


function errorMessageBox(message){
    const messageElement = document.createElement("div");
    messageElement.className = "mb-3 row message";
    messageElement.textContent = `${message}`;
    cardBody.appendChild(messageElement);
    background.style.display = "block";
}

function errorMessageforPhone(message){
    const customer = document.querySelector("#customer");
    const messageElement = document.createElement("div");
    messageElement.className = "mb-3 row message";
    messageElement.textContent = `${message}`;
    customer.appendChild(messageElement);
    background.style.display = "block";
}

background.addEventListener("click", event => {
    const message = document.querySelector(".message");
    message.remove();
    background.style.display = "none";
})