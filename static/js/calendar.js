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
      date = info.dateStr;
      const isTimeSlice = document.querySelector("#time");
      if (isTimeSlice){ isTimeSlice.remove();};
      get_time_slice_data(date);
    })
    
  })

function get_time_slice_data(date){
  fetch('/calendar/response_period/', {
    method: "POST",
    body:JSON.stringify({date: date})
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
        }else if (date != today && data.available_time){
          let morning = data.morning;
          let afternoon = data.afternoon;
          let night = data.night;
          render_time_slice(morning, afternoon, night, date);
        }else{
          render_time_slice();
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
      console.log("YES", `${date} ${element}`)
    });
    morningElement.appendChild(timeElement);
  });
  containerElement.appendChild(morningElement);
  // afternoon
  const afternoonElement = document.createElement("div");
  afternoonElement.className = "time-category";
  const afternoonTitle = document.createElement("div");
  afternoonTitle.className = "time-category-slice";
  afternoonTitle.textContent = "中午";
  afternoonElement.appendChild(afternoonTitle);
  afternoon.forEach(element => {
    const timeElement = document.createElement("div");
    timeElement.className = "time-category-slice";
    timeElement.id = "time-slice";
    timeElement.textContent = `${element}`;
    timeElement.addEventListener("click", event =>{
      console.log("YES", `${date} ${element}`)
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
      console.log("YES", `${date} ${element}`)
    })
    nightElement.appendChild(timeElement);
  });
  containerElement.appendChild(nightElement);
  calendarElement.insertAdjacentElement("afterend", containerElement);
}
