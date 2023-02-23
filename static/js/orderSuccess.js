const loading = document.querySelector("#loading");
const orderHistory = document.querySelector("#order-history");
const queryHistoryBtn = document.querySelector("#history-btn");
let pathname = window.location.pathname;
let orderid = pathname.split("/")[3];

get_paid_record();

function get_paid_record(){
    fetch("/order/get_paid_record/", {
        method: "POST",
        body: JSON.stringify({orderId: orderid})
    }).then(
        response => (response.json())
    ).then(
        data => {
            let orderData = data.data;
            orderData.forEach(order => {
                render_order_record(orderid, order.order_date, order.order_time, order.order_total_time, order.order_price);
            })
            loading.style.display = "none";
        }
    )
}

function render_order_record(orderid, date, time, total_time, price){
    const orderPaidContainer = document.createElement("div");
    orderPaidContainer.className = "container";
    orderPaidContainer.id = "order-success";

    const orderIdElement = document.createElement("div");
    orderIdElement.className = "order-info";
    orderIdElement.textContent = `訂單編號：${orderid}`;
    orderPaidContainer.appendChild(orderIdElement);

    const dateElement = document.createElement("div");
    dateElement.className = "order-info";
    dateElement.textContent = `預約日期：${date}`;
    orderPaidContainer.appendChild(dateElement);

    const timeElement = document.createElement("div");
    timeElement.className = "order-info";
    timeElement.textContent = `預約時段：${time}`;
    orderPaidContainer.appendChild(timeElement);

    const totalTimeElement = document.createElement("div");
    totalTimeElement.className = "order-info";
    totalTimeElement.textContent = `預約總時長：${total_time}`;
    orderPaidContainer.appendChild(totalTimeElement);

    const priceElement = document.createElement("div");
    priceElement.className = "order-info";
    priceElement.textContent = `預約費用：${price}`;
    orderPaidContainer.appendChild(priceElement);

    orderHistory.insertAdjacentElement("beforebegin", orderPaidContainer);
}

queryHistoryBtn.addEventListener("click", event => {
    location.href = "/order/history_order/";
})