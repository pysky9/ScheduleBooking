const orderButton = document.querySelector("#button-order")
let totalPrice = 0;
let bookingId;
let customerName;
let customerMail;

unpaid();
getCartRecord();

bookingBtn.addEventListener("click", event => {
    loading.style.display = "block";
    if (! (bookingDate && bookingTime)){
      const errorMessages = document.createElement("h5");
      errorMessages.className = "error-messages"
      errorMessages.textContent = "請選擇預約日期與時段，謝謝。";
      errorMessages.style.color = "grey";
      errorMessages.style.marginLeft = "10px";
      bookingBtn.insertAdjacentElement("afterEnd", errorMessages);
      background.style.display = " block";
      return;
    }
    let request_data = {
      "bookingDate": bookingDate,
      "bookingTime": bookingTime,
      "bookingTotalTime": bookingTotalTime,
      "bookingPrice": bookingPrice,
      "bookingStatus": "booked",
      "storeName": queryName
    };
    
  
    fetch('/cart/', {
      method: "POST",
      body: JSON.stringify({data: request_data})
    }).then(
      resp => (resp.json())
    ).then(
      data => {
        if (data.ok){
            bookingId = data.data.booking_id
            customerName = data.data.customer_name;
            customerMail = data.data.customer_mail;
            render_cart(bookingDate, bookingTime, bookingTotalTime, bookingPrice, bookingId);
            payElement.style.display = "block";
            totalExpense.textContent = `總費用：${totalPrice}`;
            location.reload();           

        }
      }
    )
  
  })

function render_cart(date, time, totalTime, price, bookingId){
    totalPrice += Number(price);
    const cartContainer = document.createElement("div");
    cartContainer.className = "container";
    cartContainer.id = "cartContainer";
    
    // close button
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.ariaLabel = "Close";
    cartContainer.appendChild(closeButton);
  
    const cartElement = document.createElement("div");
    cartElement.className = "cart";
    const bookingIdElement = document.createElement("div");
    bookingIdElement.className = "booking-id";
    bookingIdElement.textContent = `預約編號：${bookingId}`;
    cartElement.appendChild(bookingIdElement);
    const dateElement = document.createElement("div");
    dateElement.className = "booking-date";
    dateElement.textContent = `預約日期：${date}`;
    cartElement.appendChild(dateElement);
    const timeElement = document.createElement("div");
    timeElement.className = "booking-time";
    timeElement.textContent = `預約時段：${time}`;
    cartElement.appendChild(timeElement);
    const totalTimeElement = document.createElement("div");
    totalTimeElement.className = "booking-total-time";
    totalTimeElement.textContent = `時間總長：${totalTime}`;
    cartElement.appendChild(totalTimeElement);
    const priceElement = document.createElement("div");
    priceElement.className = "booking-price"
    priceElement.textContent = `預約費用：${price}`;
    cartElement.appendChild(priceElement);
  
    cartContainer.appendChild(cartElement);
  
    payElement.insertAdjacentElement("beforeBegin", cartContainer);
  
    // 刪除購物清單
    closeButton.addEventListener("click", event => {
      loading.style.display = "block";
      let request_data = {
        "bookingId": bookingId,
        "bookingStatus": "canceled"
      }
      fetch("/cart/cancel/", {
        method: "POST",
        body: JSON.stringify({"data":request_data})
      }).then(
        resp => (resp.json())
      ).then(
        data => {
            if (data.ok){
                totalPrice -= price;
                cartContainer.remove();
                totalExpense.textContent = `總費用：${totalPrice}`;
                location.reload();

                // 購物清單刪除後 如果購物車沒有預約單 移除總費用與結帳GO
                setTimeout(function(){
                  const cartContainers = document.querySelectorAll("#cartContainer");
                  if (cartContainers.length === 0){
                    payElement.remove();
                    location.reload();
                  }
                }, 3)
            }
        }
      )
    })
  
  }

function getCartRecord(){
    fetch("/cart/record/", {
      method: "POST",
      body: JSON.stringify({"storeName": queryName})
    }).then(
        resp => (resp.json())
    ).then(
        data => {
            if (data.ok){
                records = data.data
                records.forEach(record => {
                    let recordBookingId = record.booking_id;
                    let recordBookingDate = record.booking_date;
                    let recordBookingTime = record.booking_time;
                    let recordBookingTotalTime = record.booking_total_time;
                    let recordBookingPrice = record.booking_price
                    render_cart(recordBookingDate, recordBookingTime, recordBookingTotalTime, recordBookingPrice, recordBookingId);
                })
                payElement.style.display = "block";
                totalExpense.textContent = `總費用：${totalPrice}`;
            }

        }
    )
}

orderButton.addEventListener("click", event => {
    const bookingID = document.querySelectorAll(".booking-id");
    const bookingDate = document.querySelectorAll(".booking-date");
    const bookingTime = document.querySelectorAll(".booking-time");
    const bookingTotalTime = document.querySelectorAll(".booking-total-time");
    const bookingPrice = document.querySelectorAll(".booking-price");
    let orderData = [];
    for (let i = 0; i < bookingID.length; i++){
        let data = {
          "booking_id": bookingID[i].textContent.split("：")[1],
          "booking_date": bookingDate[i].textContent.split("：")[1],
          "booking_time": bookingTime[i].textContent.split("：")[1],
          "booking_total_time": bookingTotalTime[i].textContent.split("：")[1],
          "booking_price": bookingPrice[i].textContent.split("：")[1],
          "order_status": "ordering"
        }
        orderData.push(data);
    }
    responseData = {
        "orderData": orderData
    }

    fetch("/order/recieve_order/", {
        method: "POST",
        body: JSON.stringify(responseData)
    }).then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
              location.href = `/order/check_order/${data.orderId}`;
            }else{
              console.log(data.msg)
            }
        }
    )
  })

function unpaid(){
    fetch("/order/get_unpaid_order/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok && data.orderId){
                let unpaidOrderId = data.orderId[0];
                location.href = `/order/check_order/${unpaidOrderId}`;
            }
        }
    )
}