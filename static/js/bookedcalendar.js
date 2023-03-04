const loading = document.querySelector("#loading")

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let lastClickedDayEl = null;
    const calendar = new FullCalendar.Calendar(calendarEl, {
      themeSystem: 'bootstrap5',
      initialView: 'timeGridWeek',
      timeZone: 'Asia/Taipei',
      height: 650,
      fixedWeekCount: false,
      showNonCurrentDates: false,
      allDaySlot: false,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'today timeGridWeek,timeGridDay'
      },
    })

    fetch("/order/get_appointment_time/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                appointmentList = data.appointment_time;
                if (! appointmentList.length){
                    loading.style.display = "none";
                    return;
                };
                appointmentList.forEach(appointment => {
                    // 設定選擇的日期和時間
                    let selectedDate = `${appointment.appointmentDate}`;
                    let selectedTime = `${appointment.appointmentTime}`;

                    // 設定事件起始和結束時間
                    let startDate = selectedDate + 'T' + selectedTime;
                    
                    // 依商家服務時間的總長設定每個預約時段的結束時間
                    let endDate;
                    if (appointment.appointmentTotalTime.includes("小時")){
                        let hour = Number(parseInt(appointment.appointmentTotalTime, 10));
                        endDate = moment(startDate).add(hour, 'hours').format('YYYY-MM-DDTHH:mm');
                    }else if (appointment.appointmentTotalTime.includes("分")){
                        let minute = Number(parseInt(appointment.appointmentTotalTime, 10));
                        endDate = moment(startDate).add(minute, 'minutes').format('YYYY-MM-DDTHH:mm');
                    }else{
                        let day = Number(parseInt(appointment.appointmentTotalTime, 10));
                        endDate = moment(startDate).add(day, 'days').format('YYYY-MM-DDTHH:mm');
                    }
                    // 新建一個事件對象
                    let newEvent = {
                        title: `${appointment.consumerName}`,
                        start: startDate,
                        end: endDate
                    };

                    // 將事件添加到FullCalendar
                    calendar.addEvent(newEvent);
                    loading.style.display = "none";
                })
            }
        }
    )
    calendar.render();  
})

