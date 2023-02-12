const bookingBtn = document.querySelector(".btn");
const payElement = document.querySelector("#pay");
const totalExpense = document.querySelector(".total-expense");
const background = document.querySelector(".background");

let bookingDate;
let bookingTime;
let bookingTotalTime;
let bookingPrice;
let pathname = window.location.pathname;
let queryName = pathname.split("/")[3];


document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      // locale: 'zh-tw',
      height: 335,
      fixedWeekCount: false,
      showNonCurrentDates: false,
      headerToolbar: {
          right: 'today prev,next',
      },
    })

    calendar.render();

    // 載入畫面渲染當日可用時段
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    get_time_slice_data(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);

    // 使用者點擊日期顯示可用時段
    let date;
    calendar.on("dateClick", info=>{
      dateBlockElement = info.dayEl

      date = info.dateStr;

      info.dayEl.style.backgroundColor = "#0d6efd";
      const isTimeSlice = document.querySelector("#time");
      const isExspenseUnit = document.querySelector("#exspense");
      if (isTimeSlice){ isTimeSlice.remove(); };
      if (isExspenseUnit){ isExspenseUnit.remove(); };
      get_time_slice_data(date);
    })
    
  })


let totalPrice = 0;

bookingBtn.addEventListener("click", event => {
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

      let price = Number(bookingPrice);
      totalPrice += price;

      render_cart(bookingDate, bookingTime, bookingTotalTime, bookingPrice);
      payElement.style.display = "block";
      totalExpense.textContent = `總費用：${totalPrice}`;
    }
  )

})

// 點空白處 錯誤訊息消失
background.addEventListener("click", event => {
  const errorMessages = document.querySelector(".error-messages");
  background.style.display = "none";
  errorMessages.remove();

})

function get_time_slice_data(date){
  fetch('/calendar/response_period/', {
    method: "POST",
    body:JSON.stringify({date: date, username: queryName})
  }).then(response => (response.json())).then(
    data => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      let today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      if (data.OK){
        if (date === today){
          const today_data = data.today;
          let morning = today_data.morning_today;
          let afternoon = today_data.afternoon_today;
          let night = today_data.night_today;
          render_time_slice(morning, afternoon, night, date);
          get_time_price(date);
        }else if (date != today && data.available_time){
          let morning = data.morning;
          let afternoon = data.afternoon;
          let night = data.night;
          render_time_slice(morning, afternoon, night, date);
          get_time_price(date);
        }else{
          render_time_slice();
          get_time_price(date);
        }
      }

    }
  )
}

function render_time_slice(morning=[], afternoon=[], night=[], date=""){
  
  const calendarElement = document.querySelector("#calendar");
  // 大容器
  const containerElement = document.createElement("div");
  containerElement.className = "container";
  containerElement.id = "time";

  // morning
  const morningElement = document.createElement("div");
  morningElement.className = "time-category";
  const morningTitle = document.createElement("div");
  morningTitle.className = "time-category-slice";
  morningTitle.textContent = "早上";
  morningElement.appendChild(morningTitle);
  morning.forEach(element => {
    const timeElement = document.createElement("div");
    timeElement.className = "time-category-slice";
    timeElement.id = "time-slice";
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      timeElement.style.color = "red";

    });
    morningElement.appendChild(timeElement);
  });
  containerElement.appendChild(morningElement);
  // afternoon
  const afternoonElement = document.createElement("div");
  afternoonElement.className = "time-category";
  const afternoonTitle = document.createElement("div");
  afternoonTitle.className = "time-category-slice";
  afternoonTitle.textContent = "下午";
  afternoonElement.appendChild(afternoonTitle);
  afternoon.forEach(element => {
    const timeElement = document.createElement("div");
    timeElement.className = "time-category-slice";
    timeElement.id = "time-slice";
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      timeElement.style.color = "red";

    })
    afternoonElement.appendChild(timeElement);
  });
  containerElement.appendChild(afternoonElement);
  // night
  const nightElement = document.createElement("div");
  nightElement.className = "time-category";
  const nightTitle = document.createElement("div");
  nightTitle.className = "time-category-slice";
  nightTitle.textContent = "晚上";
  nightElement.appendChild(nightTitle);
  night.forEach(element => {
    const timeElement = document.createElement("div");
    timeElement.className = "time-category-slice";
    timeElement.id = "time-slice";
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      timeElement.style.color = "red";

    })
    nightElement.appendChild(timeElement);
  });
  containerElement.appendChild(nightElement);
  calendarElement.insertAdjacentElement("afterend", containerElement);


}

function get_time_price(date){
  fetch('/calendar/response_time_price/',{
    method:"POST",
    body: JSON.stringify({date: date, username: queryName})
  }).then(
    response => (response.json())
  ).then(
    data => {
   
      const timeElement = document.querySelector("#time");
      bookingTotalTime = `${data.time_slice}${data.time_slice_unit}`;
      if (data.isDiscount){

        bookingPrice = `${data.discount_price}`;
        const exspenseElement = document.createElement("div");
        exspenseElement.className = "container";
        exspenseElement.id = "exspense";
        const exspenseTitle = document.createElement("span");
        exspenseTitle.className = "exspense-title";
        exspenseTitle.textContent = "費用: ";
        exspenseElement.appendChild(exspenseTitle);
        const discountElement = document.createElement("span");
        discountElement.textContent = `NT$${data.discount_price}`;
        discountElement.className = "price";
        exspenseElement.appendChild(discountElement);
        const priceElement = document.createElement("span");
        priceElement.textContent = `NT$${data.origin_price}`;
        priceElement.style.textDecorationLine = "line-through";
        priceElement.style.color = "grey";
        priceElement.style.marginLeft = "10px";
        priceElement.className = "price";
        exspenseElement.appendChild(priceElement);
        const exspenseUnit = document.createElement("span");
        exspenseUnit.className = "exspense-unit";
        exspenseUnit.textContent = `- 每 ${data.time_slice} ${data.time_slice_unit}`;
        exspenseElement.appendChild(exspenseUnit);
        timeElement.insertAdjacentElement("afterend", exspenseElement);

      }else{
        bookingPrice = `${data.origin_price}`;
        const timeElement = document.querySelector("#time");
        const exspenseElement = document.createElement("div");
        exspenseElement.className = "container";
        exspenseElement.id = "exspense";
        const exspenseTitle = document.createElement("span");
        exspenseTitle.className = "exspense-title";
        exspenseTitle.textContent = "費用: ";
        exspenseElement.appendChild(exspenseTitle);
        const priceElement = document.createElement("span");
        priceElement.textContent = `NT$${data.origin_price}`;
        priceElement.className = "price";
        exspenseElement.appendChild(priceElement);
        const exspenseUnit = document.createElement("span");
        exspenseUnit.className = "exspense-unit";
        exspenseUnit.textContent = `- 每 ${data.time_slice} ${data.time_slice_unit}`;
        exspenseElement.appendChild(exspenseUnit);
        timeElement.insertAdjacentElement("afterend", exspenseElement);
      }
    }
  )
}

function render_cart(date, time, totalTime, price){
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
  const dateElement = document.createElement("div");
  dateElement.textContent = `預約日期：${date}`;
  cartElement.appendChild(dateElement);
  const timeElement = document.createElement("div");
  timeElement.textContent = `預約時段：${time}`;
  cartElement.appendChild(timeElement);
  const totalTimeElement = document.createElement("div");
  totalTimeElement.textContent = `時間總長：${totalTime}`;
  cartElement.appendChild(totalTimeElement);
  const priceElement = document.createElement("div");
  priceElement.textContent = `預約費用：${price}`;
  cartElement.appendChild(priceElement);

  cartContainer.appendChild(cartElement);

  payElement.insertAdjacentElement("beforeBegin", cartContainer);

  // 刪除購物清單
  closeButton.addEventListener("click", event => {
    
    totalPrice -= price;
    cartContainer.remove();
    totalExpense.textContent = `總費用：${totalPrice}`;

    // 購物清單刪除後 如果購物車沒有預約單 移除總費用與結帳GO
    setTimeout(function(){
      const cartContainers = document.querySelectorAll("#cartContainer");
      if (cartContainers.length === 0){
        payElement.remove();
        location.reload();
      }
    }, 3)
  })

}
