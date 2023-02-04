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

    const monthElement = document.querySelector(".fc-toolbar-title");
    let month = monthElement.textContent.split(" ")[0];
    console.log(month);
    let date;
    calendar.on("dateClick", info=>{
      date = info.dateStr;
      console.log(info.dateStr)
      // get_data(month, date);
      get_data(date);
    })
    
  })

function get_data(date){
  fetch('/calendar/response_period/', {
    method: "POST",
    body:JSON.stringify({date: date})
  }).then(response => (response.json())).then(
    data => {
      console.log(data);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      let today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      console.log("date === today is ", date === today)
      console.log(`${hours}:${minutes}`)
      
    }
  )
}

// 每個時段都安裝監聽事件 -> 運行OK
const datesClick = document.querySelectorAll("#time-slice")
datesClick.forEach(function(element){
  element.addEventListener("click", event =>{
    console.log("YES", `${element.textContent}`)
  })
})