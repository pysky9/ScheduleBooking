const bookingBtn = document.querySelector("#booking-btn");
const payElement = document.querySelector("#pay");
const totalExpense = document.querySelector(".total-expense");
const background = document.querySelector(".background");
const navbarBrand = document.querySelector(".navbar-brand");
const loading = document.querySelector("#loading");
let bookingDate;
let bookingTime;
let bookingTotalTime;
let bookingPrice;
let pathname = window.location.pathname;
let queryName = pathname.split("/")[3];
// 取得今天的日期
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
let today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let lastClickedDayEl = null;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      timeZone: 'Asia/Taipei',
      height: 335,
      fixedWeekCount: false,
      showNonCurrentDates: false,
      headerToolbar: {
          right: 'today prev,next',
      },
      dateClick: function(info){
        // 改變被點擊的日期的字體色/背景色
        if (lastClickedDayEl){
          lastClickedDayEl.style.backgroundColor = "#d0d0d0";
        }
        info.dayEl.style.backgroundColor = '#4EB3D3';
        lastClickedDayEl = info.dayEl;
      },
      validRange: {
        start: today
      }
    })

    calendar.render();

    get_time_slice_data(today);
    // 使用者點擊日期顯示可用時段
    let date;

    calendar.on("dateClick", info=>{
      date = info.dateStr;
      const isTimeSlice = document.querySelector("#time");
      const isExspenseUnit = document.querySelector("#exspense");
      if (isTimeSlice){ isTimeSlice.remove(); };
      if (isExspenseUnit){ isExspenseUnit.remove(); };
      get_time_slice_data(date);
    })
  })



// 點空白處 錯誤訊息消失
background.addEventListener("click", event => {
  const errorMessages = document.querySelector(".error-messages");
  background.style.display = "none";
  errorMessages.remove();

})

function get_time_slice_data(date){
  loading.style.display = "block";
  fetch('/calendar/response_period/', {
    method: "POST",
    body:JSON.stringify({date: date, username: queryName})
  }).then(response => (response.json())).then(
    data => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      let today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (data.OK){
        let timeSet = data.timeData;
        if (!timeSet.length){
          const loadingElement = document.querySelector("#loading");
          const message = document.createElement("div");
          message.textContent = "無可預約時段";
          message.id = "time";
          loadingElement.insertAdjacentElement("afterend", message)
          bookingBtn.style.display = "none";  
          const preButton = document.querySelector(".fc-prev-button");
          const nextButton = document.querySelector(".fc-next-button");
          const todayButton = document.querySelector(".fc-today-button");
          todayButton.addEventListener("click", event => {
            message.remove();
          });
          preButton.addEventListener("click", event => {
            message.remove();
          });
          nextButton.addEventListener("click", event => {
            message.remove();
          });
        }
        timeSet.forEach(time => {
          if (date === today){
            const today_data = time.today;
            let morning = today_data.morning_today;
            let afternoon = today_data.afternoon_today;
            let night = today_data.night_today;
            render_time_slice(morning, afternoon, night ,date);
            get_time_price(date);
            getReservationTime(date);
            bookingBtn.style.display = "block";
          }else if (date != today && time.available_time){
            let morning = time.morning;
            let afternoon = time.afternoon;
            let night = time.night;
            render_time_slice(morning, afternoon, night, date);
            getReservationTime(date);
            get_time_price(date);
            bookingBtn.style.display = "block";
          }else{
            render_time_slice();
            get_time_price(date);
            getReservationTime(date);
            bookingBtn.style.display = "none";          
          }
        })
      }
      setTimeout(() => {
        loading.style.display = "none";
      }, 2500);
      
    }
  )
}

//get_reservation_time, avoid double-booking
function getReservationTime(date){
  fetch("/calendar/get_reservation_time/", {
    method: "POST",
    body: JSON.stringify({date: date})
  }).then(
    response => (response.json())
  ).then(
    data => {
      if (data.ok){
        const reservations = data.reservation_time_list;
        reservations.forEach(reservation => {
          const bookedElement = document.createElement("div")
          const {reservation_date, reservation_time} = reservation;
          const date_time = `${reservation_date}-${reservation_time}`;
          const timeDiv = document.getElementsByName(`${date_time}`);
          if (!timeDiv.length) return;
          timeDiv[0].style.color = "#E0E0E0";
          timeDiv[0].style.pointerEvents = "none";
          timeDiv[0].style.backgroundColor = "#f7f1f0";
          bookedElement.textContent = "(預約已滿)";
          bookedElement.className = "time-booked";
          timeDiv[0].insertAdjacentElement("afterend", bookedElement);
        })
      }
    }
  )
}

// 點擊時間/日期 改變被點擊區塊被景色
let selectedTimeSlot = null;
const container = document.querySelector('.container');
const timeSlice = document.querySelectorAll("#time-slice");

container.addEventListener("click", event => {
  const isClickInsideTimeSlice = event.target.classList.contains("time-slice");
  const isClickInsideContainer = event.target.classList.contains("container");
  if(! isClickInsideTimeSlice && isClickInsideContainer){
    if (selectedTimeSlot) {
      selectedTimeSlot.style.color = "black";
      selectedTimeSlot.style.backgroundColor = "#f7f1f0";
      selectedTimeSlot = null;
    }
  }
})

function render_time_slice(morning=[], afternoon=[], night=[], date=""){
  const loadingElement = document.querySelector("#loading");
  // 大容器
  const containerElement = document.createElement("div");
  containerElement.className = "container";
  containerElement.id = "time";
  containerElement.style.position = "relative"

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
    timeElement.setAttribute("name", `${date}-${element}`);
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      // 判斷時段是否被點擊 被點擊->改背景色
      if (selectedTimeSlot === timeElement){
          selectedTimeSlot.style.color = "black";
          selectedTimeSlot.style.backgroundColor = "#f7f1f0";
          selectedTimeSlot = null;
      }else{
          if (selectedTimeSlot) {
            selectedTimeSlot.style.color = "black";
            selectedTimeSlot.style.backgroundColor = "#f7f1f0";
          }
          timeElement.style.color = "white";
          timeElement.style.backgroundColor = "#79031D"
          selectedTimeSlot = timeElement;
      }
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
    timeElement.setAttribute("name", `${date}-${element}`);
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      if (selectedTimeSlot === timeElement){
        selectedTimeSlot.style.color = "black";
        selectedTimeSlot.style.backgroundColor = "#f7f1f0";
        selectedTimeSlot = null;
      }else{
        if (selectedTimeSlot) {
          selectedTimeSlot.style.color = "black";
          selectedTimeSlot.style.backgroundColor = "#f7f1f0";
        }
        timeElement.style.color = "white";
        timeElement.style.backgroundColor = "#79031D"
        selectedTimeSlot = timeElement;
    }
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
    timeElement.setAttribute("name", `${date}-${element}`);
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      bookingDate = `${date}`;
      bookingTime = `${element}`;
      if (selectedTimeSlot === timeElement){
        selectedTimeSlot.style.color = "black";
        selectedTimeSlot.style.backgroundColor = "#f7f1f0";
        selectedTimeSlot = null;
      }else{
        if (selectedTimeSlot) {
          selectedTimeSlot.style.color = "black";
          selectedTimeSlot.style.backgroundColor = "#f7f1f0";
        }
        timeElement.style.color = "white";
        timeElement.style.backgroundColor = "#79031D"
        selectedTimeSlot = timeElement;
    }
    })
    nightElement.appendChild(timeElement);
  });
  containerElement.appendChild(nightElement);
  loadingElement.insertAdjacentElement("afterend", containerElement);

  // pre-button next-button
  const preButton = document.querySelector(".fc-prev-button");
  const nextButton = document.querySelector(".fc-next-button");
  const todayButton = document.querySelector(".fc-today-button");
  todayButton.addEventListener("click", event => {
    bookingBtn.style.display = "none";
    containerElement.remove();
  });
  preButton.addEventListener("click", event => {
    bookingBtn.style.display = "none";
    containerElement.remove();
  });
  nextButton.addEventListener("click", event => {
    bookingBtn.style.display = "none";
    containerElement.remove();
  });
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
      const exspenseElement = document.createElement("div");
      bookingTotalTime = `${data.time_slice}${data.time_slice_unit}`;
      if (data.isDiscount){
        bookingPrice = `${data.discount_price}`;
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
      // pre-button next-button
      const preButton = document.querySelector(".fc-prev-button");
      const nextButton = document.querySelector(".fc-next-button");
      const todayButton = document.querySelector(".fc-today-button");
      todayButton.addEventListener("click", event => {
        exspenseElement.remove();
      });
      preButton.addEventListener("click", event => {
        exspenseElement.remove();
      });
      nextButton.addEventListener("click", event => {
        exspenseElement.remove();
      });
    }
  )
}

