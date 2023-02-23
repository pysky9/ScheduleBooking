// const customerBtn = document.querySelector("#customer-btn");
const customerNameElement = document.querySelector("#customer-name");
const customerEmailElement = document.querySelector("#customer-email");
const customerBookingBtn = document.querySelector("#customer-btn");
const orderHistoryBtn = document.querySelector("#order-icon");
const unpaidBtn = document.querySelector("#cash-icon");
let customerName = customerNameElement.textContent;
let customerEmail = customerEmailElement.textContent;
let pathName = window.location.pathname;
let storeName = pathName.split("/")[3];





unpaidBtn.addEventListener("click", unpaid);

customerBookingBtn.addEventListener("click", event => {
    location.href = `/calendar/views/${storeName}`;
})

function unpaid(){
    fetch("/order/get_unpaid_order/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                let unpaidOrderId = data.orderId[0];
                location.href = `/order/check_order/${unpaidOrderId}`;
            } 
        }
    )
}