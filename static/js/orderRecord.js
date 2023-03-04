const tableBody = document.querySelector("tbody");
const loading = document.querySelector("#loading");
const loadmoreBtn = document.querySelector(".btn-primary");
const loadingMore = document.querySelector("#loadmore")
let currentPage = 1;

customerBookedData();

loadmoreBtn.addEventListener("click",customerBookedData);

function customerBookedData(){
    loadingMore.style.display = "block";
    loadmoreBtn.style.display = "none";
    fetch(`/order/customer_booked_data/?page=${currentPage}`).then(
        response => (response.json())
    ).then(
        data => {
            console.log(data);
            if (data.ok){
                if (data.orderData){
                    renderOrderRecords(data.orderData);
                }
                if (!data.orderData.length){
                    if (currentPage === 1){
                        renderNoRecords();
                        loadmoreBtn.remove();
                    }else{
                        loadmoreBtn.remove();
                    }
                }
                loading.style.display = "none";
                loadingMore.style.display = "none";
                loadmoreBtn.style.display = "block";
                currentPage += 1;
            }
        }
    )
}

function renderOrderRecords(orderData){
    console.log(orderData)
    orderData.forEach(order => {
        const trContainer = document.createElement("tr");

        const customerNameElement = document.createElement("td");
        customerNameElement.textContent = `${order.customerName}`;
        trContainer.appendChild(customerNameElement);

        const customerMailElement = document.createElement("td");
        customerMailElement.textContent = `${order.customerMail}`;
        trContainer.appendChild(customerMailElement);

        const orderIdElement = document.createElement("td");
        orderIdElement.textContent = `${order.orderId}`;
        trContainer.appendChild(orderIdElement);

        const orderDateElement = document.createElement("td");
        orderDateElement.textContent = `${order.orderDate}`;
        trContainer.appendChild(orderDateElement);

        const orderTimeElement = document.createElement("td");
        orderTimeElement.textContent = `${order.orderTime}`;
        trContainer.appendChild(orderTimeElement);

        const orderTotalTimeElement = document.createElement("td");
        orderTotalTimeElement.textContent = `${order.orderTotalTime}`;
        trContainer.appendChild(orderTotalTimeElement);

        const orderPriceElement = document.createElement("td");
        orderPriceElement.textContent = `${order.orderPrice}`;
        trContainer.appendChild(orderPriceElement);

        const orderStatusElement = document.createElement("td");
        orderStatusElement.className = "order-status";
        if (order.orderStatus === "payed"){
            orderStatusElement.textContent = "已付款";
        }else if (order.orderStatus === "ordering"){
            orderStatusElement.textContent = "尚未付款";
            orderStatusElement.style.color = "red";
        }else if (order.orderStatus === "unpaid_storeCanceled"){
            orderStatusElement.textContent = "未付款-商家取消";
        }else if (order.orderStatus === "paid_storeCanceled"){
            orderStatusElement.textContent = "已付款-商家取消";
        }else{
            orderStatusElement.textContent = "客戶未付款取消";
        }
        trContainer.appendChild(orderStatusElement);

        const storeCancelElement = document.createElement("td");
        const cancelButton = document.createElement("button");
        storeCancelElement.class = "store-cancel"
        cancelButton.setAttribute("type", "button");
        cancelButton.className = "btn btn-primary";
        cancelButton.id = "cancel-button";
        cancelButton.textContent = "取消";
        storeCancelElement.appendChild(cancelButton);
        trContainer.appendChild(storeCancelElement);
        tableBody.appendChild(trContainer);

        const loadingCancelBtn = document.createElement("button");
        loadingCancelBtn.className = "btn btn-primary";
        loadingCancelBtn.id = "loading-cancel";
        loadingCancelBtn.setAttribute("type", "button");
        loadingCancelBtn.setAttribute("disabled", "disabled");
        loadingCancelBtn.textContent = "取消";
        const spanElement = document.createElement("span");
        spanElement.className = "spinner-border spinner-border-sm";
        spanElement.setAttribute("role", "status");
        spanElement.setAttribute("aria-hidden", "true");
        loadingCancelBtn.appendChild(spanElement);
        storeCancelElement.append(loadingCancelBtn);

        cancelButton.addEventListener("click", event => {
            // loading.style.display = "block";
            let orderStatus;
            loadingCancelBtn.style.display = "block";
            cancelButton.style.display = "none"
            cancelButton.setAttribute("disabled", "disabled");
            if (orderStatusElement.textContent === "已付款"){
                orderStatus = "paid_storeCanceled";
            }else if (orderStatusElement.textContent === "尚未付款"){
                orderStatus = "unpaid_storeCanceled";
            }
            storeCancelOrder(order.bookingId, orderStatus, loadingCancelBtn, cancelButton, orderStatusElement);
            // location.reload();
        })
    })
    const orderStatusElement = document.querySelectorAll(".order-status");
    const cancelButton = document.querySelectorAll("#cancel-button");
    for(let i=0; i < orderStatusElement.length; i++){
        const statusText = orderStatusElement[i].textContent;
        if (["客戶未付款取消", "已付款-商家取消", "未付款-商家取消"].includes(statusText)){
            cancelButton[i].setAttribute("disabled", "disabled");
        }
    }
}

function renderNoRecords(){
    const trElement = document.createElement("tr");
    const tdElement = document.createElement("td");
    tdElement.setAttribute("colspan", "9");
    tdElement.textContent = "尚無客戶訂單資料";
    trElement.appendChild(tdElement);
    tableBody.appendChild(trElement);
}

function storeCancelOrder(bookingId, orderStatus, loadingCancelBtn, cancelButton, orderStatusElement){
    fetch("/order/store_cancel_order/", {
        method: "POST",
        body: JSON.stringify({booking_id: bookingId, order_status: orderStatus})
    }).then(
        response => (response.json())
    ).then(
        data => {
            console.log(data)
            if (data.ok){
                cancelButton.setAttribute("disabled", "disabled");
                loadingCancelBtn.style.display = "none";
                cancelButton.style.display = "block";
                orderStatusElement.style.color = "black";
                if (orderStatus === "paid_storeCanceled"){
                    orderStatusElement.textContent = "已付款-商家取消";
                }else if (orderStatus === "unpaid_storeCanceled"){
                    orderStatusElement.textContent = "未付款-商家取消";
                }
                
            }
        }
    )
}