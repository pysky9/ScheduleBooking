const customerNameElement = document.querySelector("#customer-name");
const customerEmailElement = document.querySelector("#customer-email");
const customerBookingBtn = document.querySelector("#customer-btn");
const orderHistoryBtn = document.querySelector("#order-icon");
const unpaidBtn = document.querySelector("#cash-icon");
const dialogWindow = document.querySelector(".modal");
const closeIcon = document.querySelector(".btn-close");
const btnClose = document.querySelector("#close-btn");
const consumptionAmount = document.querySelector("#get-price");
const consumptionTimes = document.querySelector("#get-times");
const loading = document.querySelector("#loading");
let customerName = customerNameElement.textContent;
let customerEmail = customerEmailElement.textContent;
let pathName = window.location.pathname;
let storeName = pathName.split("/")[3];



get_history_order();

unpaidBtn.addEventListener("click", unpaid);

customerBookingBtn.addEventListener("click", event => {
    location.href = `/calendar/views/${storeName}`;
})

orderHistoryBtn.addEventListener("click", event => {
    location.href = `/order/history_order/`;
})

closeIcon.addEventListener("click", event => {
    dialogWindow.style.display = "none";
})

btnClose.addEventListener("click", event => {
    dialogWindow.style.display = "none";
})

function unpaid(){
    fetch("/order/get_unpaid_order/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok && data.orderId){
                let unpaidOrderId = data.orderId[0];
                location.href = `/order/check_order/${unpaidOrderId}`;
            }else{
                dialogWindow.style.display = "block";
            } 
        }
    )
}

function get_history_order(){
    fetch("/order/get_order_history/").then(
        response => (response.json())
    ).then(
        data => {

            if (data.ok){
                let historyOrders = data.order_data;
                let totalAmount = 0;
                let totalBookings = 0;
                if (!data.order_data.length){
                    consumptionAmount.textContent = `$${totalAmount}`;
                    consumptionTimes.textContent = `${totalBookings}`;
                    loading.style.display = "none";
                    return;
                }else{
                    historyOrders.forEach(order => {
                        if (order.order_status === "payed"){
                            totalAmount += Number(order.order_price);
                            totalBookings += 1;
                        }
                        consumptionAmount.textContent = `$${totalAmount}`;
                        consumptionTimes.textContent = `${totalBookings}`;
                        loading.style.display = "none";
                    })
                }
            }
        }
    )
}