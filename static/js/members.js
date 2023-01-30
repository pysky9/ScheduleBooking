
// 選項呈現對應的有效範圍
// let selectElement = document.querySelector(".time-setting");
let selectElement = document.querySelectorAll(".time-setting");
let timeSelect1 = document.querySelector(".time-select-1");
let timeSelect2 = document.querySelectorAll(".time-select-2");
let timeSettingValue;
selectElement.forEach(function(select){
  select.addEventListener("change", function(event){
    if (event.target.value === "每日幾點到幾點"){
      event.target.closest("tr").querySelector(".time-select-1").style.display = "table-cell";
      event.target.closest("tr").querySelectorAll(".time-select-2")[0].style.display = "none";
      // event.target.closest("tr").querySelectorAll(".time-select-2")[1].style.display = "none";
      timeSettingValue = event.target.value;
    }else {
      event.target.closest("tr").querySelector(".time-select-1").style.display = "none";
      event.target.closest("tr").querySelectorAll(".time-select-2")[0].style.display = "table-cell";
      // event.target.closest("tr").querySelectorAll(".time-select-2")[1].style.display = "table-cell";
      timeSettingValue = event.target.value;
    }
  })
})
// selectElement.addEventListener("change", event => {
//     console.log(selectElement)
//     if(event.target.value === "每日幾點到幾點"){
//         timeSelect1.style.display = "block";
//         // timeSelect2[0].style.display = "none";
//         // timeSelect2[1].style.display = "none";
//         timeSelect2.forEach(element => {
//             element.style.display = "none";
//         })
//     }else{
//         timeSelect1.style.display = "none";
//         // timeSelect2[0].style.display = "block";
//         // timeSelect2[1].style.display = "block";
//         timeSelect2.forEach(element =>{
//             element.style.display = "block";
//         })
//     }
// })

// 點"新增時段" -> HTML插入選單
const timeSetElement = document.querySelector(".time-set");
const addTimePeriod = document.querySelector(".create-time-period");
addTimePeriod.addEventListener("click", event => {
  const newTr = document.createElement("tr");
  newTr.innerHTML = `
  <td>
    <select class="time-setting" title="time-setting-category">
      <option>請選擇</option>                          
      <option value="每日幾點到幾點">每日幾點到幾點</option>
      <option value="特定時間範圍，每日幾點到幾點">特定時間範圍，每日幾點到幾點</option>
    </select>
  </td>
  <td class="time-select-1"><input type="time"> <input type="time"></td>
  <td class="time-select-2"><input type="date"> <input type="date"></td>
  <td class="time-select-2"><input type="time"> <input type="time"></td>
  `
  timeSetElement.appendChild(newTr);
  selectElement = document.querySelectorAll(".time-setting");
})


// 點"新增時段" -> HTML插入選單
// const addTimePeriod = document.querySelector(".create-time-period");
// addTimePeriod.addEventListener("click", event => {
//     html = `
//     <table class="table">
//     <thead>
//       <tr>
//         <th scope="col">時段種類</th>
//         <th scope="col">有效範圍</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>
//           <select class="time-setting">                          
//             <option value="每日幾點到幾點">每日幾點到幾點</option>
//             <option value="特定時間範圍，每日幾點到幾點">特定時間範圍，每日幾點到幾點</option>
//           </select>
//         </td>
//         <td class="time-select-1"><input type="time"> <input type="time"></td>
//         <td class="time-select-2"><input type="date"> <input type="date"></td>
//         <td class="time-select-2"><input type="time"> <input type="time"></td>
//       </tr>

//     </tbody>
//   </table>
//     `
//     addTimePeriod.insertAdjacentHTML("beforebegin", html);
//     selectElement = document.querySelectorAll(".time-setting");
// })

// 訂金選項顯示&隱藏

const deposit = document.querySelector(".deposit");
const depositChoose = document.querySelector(".deposit-choose");
let depositChooseValue;
depositChoose.addEventListener("change", event => {
    if (event.target.value === "NO-暫不啟用"){
        deposit.style.display = "none";
        depositChooseValue = event.target.value;
    }else{
        deposit.style.display = "block";
        depositChooseValue = event.target.value;
    }

})

// 資料更新
const update = document.querySelector(".update");
const timeSliceElement = document.querySelector(".time-select-slice");
let timeSliceValue;
timeSliceElement.addEventListener("change", event => {
  timeSliceValue = event.target.value;
})

const timeSelectBooking = document.querySelector(".time-select-booking");
let timeSelectBookingValue;
timeSelectBooking.addEventListener("change", event => {
  timeSelectBookingValue = event.target.value;
});

const timeCancelSelect = document.querySelector(".time-cancel");
let timeCancelSelectValue;
timeCancelSelect.addEventListener("change", event => {
  timeCancelSelectValue = event.target.value;
});

const depositItemElement = document.querySelector(".deposit-item");
let depositItem;
depositItemElement.addEventListener("change", event => {
  depositItem = event.target.value;
})

const csrfElement = document.getElementsByName("csrfmiddlewaretoken");

update.addEventListener("click", event => {
  const priceOrginElement = document.querySelector(".price-orgin");
  let priceOrgin = priceOrginElement.value;
  const priceDiscountElement = document.querySelector(".price-discount");
  let priceDiscount = priceDiscountElement.value;
  const priceDiscountBeginDateElement = document.querySelector(".price-discount-begin-date");
  let priceDiscountBeginDate = priceDiscountBeginDateElement.value;
  const priceDiscountEndDateElement = document.querySelector(".price-discount-end-date");
  let priceDiscountEndDate = priceDiscountEndDateElement.value;
  const timeNumberElement = document.querySelector(".timeNumber");
  let timeNumber = timeNumberElement.value;
  const timeBookingElement = document.querySelector(".timeBooking");
  let timeBooking = timeBookingElement.value;
  const bookingAudit = document.querySelector(".booking-audit");
  let bookingAuditCheck;
  if (bookingAudit.checked){
    bookingAuditCheck = "Yes";
  }else{
    bookingAuditCheck = "No";
  };
  const bookingCancel = document.querySelector(".booking-cancel");
  let bookingCancelCheck;
  if (bookingCancel.checked){
    bookingCancelCheck = "Yes";
  }else{
    bookingCancelCheck = "No";
  }
  const dayNumberElement = document.querySelector(".dayNumber");
  let dayNumber = dayNumberElement.value;
  const timeSelectBeginTimeElement = document.querySelector(".time-select-bigintime");
  const timeSelectEndTimeElement = document.querySelector(".time-select-endtime");
  const timeSelectBeginTimeElementOption = document.querySelector(".time-select-begintime-2");
  const timeSelectEndTimeElementOption = document.querySelector(".time-select-endtime-2");
  let timeSelectBeginTime;
  let timeSelectEndTime;
  if (timeSettingValue === "每日幾點到幾點"){
    timeSelectBeginTime = timeSelectBeginTimeElement.value;
    timeSelectEndTime = timeSelectEndTimeElement.value;
  } else {
    timeSelectBeginTime = timeSelectBeginTimeElementOption.value;
    timeSelectEndTime = timeSelectEndTimeElementOption.value;
  };
  const timeSelectBeginDateElement = document.querySelector(".time-select-begindate");
  const timeSelectEndDateElement = document.querySelector(".time-select-enddate")
  let timeSelectBeginDate = timeSelectBeginDateElement.value;
  let timeSelectEndDate = timeSelectEndDateElement.value;
  const totalDepositElement = document.querySelector(".total-deposit");
  let totalDeposit = totalDepositElement.value;
  let updateAllData = {
    orignPrice: priceOrgin,
    discountPrice: priceDiscount,
    discountBeginDate: priceDiscountBeginDate,
    discountEndDate: priceDiscountEndDate,
    timeNumbers: timeNumber,
    timeSliceUnit: timeSliceValue,
    timeBookingNums: timeBooking,
    timeBookingUnit: timeSelectBookingValue,
    bookingAudits: bookingAuditCheck,
    bookingCancels: bookingCancelCheck,
    cancelDayNumber: dayNumber,
    cancelTimeUnit: timeCancelSelectValue,
    timeSettingCategory: timeSettingValue,
    timeSettingBegintime: timeSelectBeginTime,
    timeSettingEndtime: timeSelectEndTime,
    timeSettingBegindate: timeSelectBeginDate,
    timeSettingEnddate: timeSelectEndDate,
    depositChooses: depositChooseValue,
    depositItems: depositItem,
    totalDeposits: totalDeposit
  };
  console.log(updateAllData);
  const token = csrfElement[0].defaultValue;
  
  fetch("/calendar/setting/", {
    method:"POST",
    headers:{
      "X-CSRFToken": token
    },
    body: JSON.stringify(updateAllData)
  }).then(resp => (resp.json())).then(
    data =>{
      console.log(data)
    }
  )
})