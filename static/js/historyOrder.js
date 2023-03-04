const historyTitle = document.querySelector("#history-title");
const webPageLoading = document.querySelector("#loading");

get_history_order();

function get_history_order(){
    fetch("/order/get_order_history/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                let historyOrders = data.order_data;
                historyOrders.forEach(order => {
                    render_order_record(order.order_id, order.order_date, order.order_time, order.order_total_time, order.order_price, order.order_status);
                })
                webPageLoading.style.display = "none";
            }
        }
    )
}

function render_order_record(orderid, date, time, total_time, price, orderStatus){
    const orderHistoryContainer = document.createElement("div");
    orderHistoryContainer.className = "container";
    orderHistoryContainer.id = "order-history";

    const orderIdElement = document.createElement("div");
    orderIdElement.className = "order-info";
    orderIdElement.textContent = `訂單編號：${orderid}`;
    orderHistoryContainer.appendChild(orderIdElement);

    const dateElement = document.createElement("div");
    dateElement.className = "order-info";
    dateElement.textContent = `預約日期：${date}`;
    orderHistoryContainer.appendChild(dateElement);

    const timeElement = document.createElement("div");
    timeElement.className = "order-info";
    timeElement.textContent = `預約時段：${time}`;
    orderHistoryContainer.appendChild(timeElement);

    const totalTimeElement = document.createElement("div");
    totalTimeElement.className = "order-info";
    totalTimeElement.textContent = `預約總時長：${total_time}`;
    orderHistoryContainer.appendChild(totalTimeElement);

    const priceElement = document.createElement("div");
    priceElement.className = "order-info";
    priceElement.textContent = `預約費用：${price}`;
    orderHistoryContainer.appendChild(priceElement);

    const orderStatusElement = document.createElement("div");
    orderStatusElement.className = "order-info";
    if (orderStatus=== "canceled"){
        orderStatusElement.textContent = `訂單狀態：客戶取消`;
    }else if (orderStatus === "paid_storeCanceled"){
        orderStatusElement.textContent = "訂單狀態：已付款-商家取消";
    }else if (orderStatus === "unpaid_storeCanceled"){
        orderStatusElement.textContent = "訂單狀態：未付款-商家取消";
    }else {
        orderStatusElement.textContent = `訂單狀態：已付款`;
    }
    orderHistoryContainer.appendChild(orderStatusElement);

    historyTitle.appendChild(orderHistoryContainer);
}