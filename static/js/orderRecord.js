const tableBody = document.querySelector("tbody");
const loading = document.querySelector("#loading");

customerBookedData()

function customerBookedData(){
    fetch("/order/customer_booked_data/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                if (data.orderData){
                    renderOrderRecords(data.orderData);
                }
                if (!data.orderData.length){
                    console.log("no data")
                    renderNoRecords();
                }
                loading.style.display = "none";
            }
        }
    )
}

function renderOrderRecords(orderData){
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
        }else {
            orderStatusElement.textContent = "商家取消";
        }
        trContainer.appendChild(orderStatusElement);

        const storeCancelElement = document.createElement("td");
        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button");
        cancelButton.className = "btn btn-primary";
        cancelButton.textContent = "取消";
        storeCancelElement.appendChild(cancelButton);
        trContainer.appendChild(storeCancelElement);
        tableBody.appendChild(trContainer);

        cancelButton.addEventListener("click", event => {
            loading.style.display = "block";
            cancelButton.setAttribute("disabled", "disabled");
            storeCancelOrder(order.bookingId);
            location.reload();
        })
    })
    const orderStatusElement = document.querySelectorAll(".order-status");
    const cancelButton = document.querySelectorAll(".btn");
    for(let i=0; i < orderStatusElement.length; i++){
        if (orderStatusElement[i].textContent === "商家取消"){
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

function storeCancelOrder(bookingId){
    const orderStatusElement = document.querySelector(".order-status");
    fetch("/order/store_cancel_order/", {
        method: "POST",
        body: JSON.stringify({booking_id: bookingId})
    }).then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                loading.style.display = "none";
            }
            
        }
    )
}