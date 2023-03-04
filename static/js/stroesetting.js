let membersData;
const modalDialog = document.querySelector(".modal"); 
const modalBody = document.querySelector(".modal-body");
const closeIcon = document.querySelector(".btn-close");
const btnClose = document.querySelector("#close-btn");
const launchDiscount = document.querySelector("#launch-discount");
const closeDiscount = document.querySelector("#close-discount");
const discountBlock = document.querySelector(".discount");
const timeSliceInfo = document.querySelector(".time-slice-info");

launchDiscount.addEventListener("click", event => {
  discountBlock.style.display = "block";
})

closeDiscount.addEventListener("click", event => {
  const discountElement = document.querySelector(".price-discount");
  if (discountElement.value){
    discountElement.value = "";
  }
  discountBlock.style.display = "none";
})

// 資料更新
const update = document.querySelector("#update");
const timeSliceElement = document.querySelector(".time-select-slice");
let timeSliceValue;

timeSliceElement.addEventListener("change", event => {
  timeSliceValue = event.target.value;
  if (timeSliceValue === "分"){
    timeSliceInfo.style.display = "block";
  }else{
    timeSliceInfo.style.display = "none";
  }
})

const csrfElement = document.getElementsByName("csrfmiddlewaretoken");
const updating = document.querySelector("#updating")
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
  const timeSelectBeginTimeElement = document.querySelector(".time-select-begintime");
  const timeSelectEndTimeElement = document.querySelector(".time-select-endtime");
  let timeSelectBeginTime = timeSelectBeginTimeElement.value;
  let timeSelectEndTime = timeSelectEndTimeElement.value;
  const timeSelectBeginDateElement = document.querySelector(".time-select-begindate");
  const timeSelectEndDateElement = document.querySelector(".time-select-enddate")
  let timeSelectBeginDate = timeSelectBeginDateElement.value;
  let timeSelectEndDate = timeSelectEndDateElement.value;
  let beginDate = new Date(timeSelectBeginDate);
  let endDate = new Date(timeSelectEndDate);
  // 判斷欄位是否為數字
  const numberPattern = /^[0-9]+$/;
  const timeNumberIsValidation = numberPattern.test(timeNumber);
  const originPriceIsValidation = numberPattern.test(priceOrgin);
  const discountPriceIsValidation = numberPattern.test(priceDiscount);

  if (beginDate > endDate){
    modalDialog.style.display = "block"
    modalBody.textContent = "結束日期要大於開始日期";
    return;
  };

  // 必填欄位判斷
 
  if (!priceOrgin){
    modalDialog.style.display = "block"
    modalBody.textContent = "請填入原價";
    return;
  };
  if (!timeNumber || !timeSliceValue){
    modalDialog.style.display = "block"
    modalBody.textContent = "請填入單次服務時長";
    return;
  };
  if (!timeSelectBeginDate || !timeSelectEndDate){
    modalDialog.style.display = "block"
    modalBody.textContent = "請設定開始或結束日期";
    return;
  };

  if (!timeSelectBeginTime || !timeSelectEndTime){
    modalDialog.style.display = "block"
    modalBody.textContent = "請設定開始或結束時段";
    return;
  };

  if (priceDiscount){
    if (!priceDiscountBeginDate){
      modalDialog.style.display = "block"
      modalBody.textContent = "請填入折扣價起始日期";
      return;
    }else if (!priceDiscountEndDate){
      modalDialog.style.display = "block"
      modalBody.textContent = "請填入折扣價結束日期";
      return;
    }
    if (!discountPriceIsValidation){
      modalDialog.style.display = "block"
      modalBody.textContent = "折扣價欄位請輸入數字";
      return;
    };
  
  };
  
  if (timeSliceValue === "分"){
    if ( Number(timeNumber) % 30 != 0 || Number(timeNumber) > 1440){
      modalDialog.style.display = "block"
      modalBody.textContent = "請輸入正確時間";
      return;
    };
  };
  if (timeSliceValue === "小時"){
    if (Number(timeNumber) > 24){
      modalDialog.style.display = "block"
      modalBody.textContent = "請輸入正確時間";
      return;
    };
  };
  if (timeSliceValue === "日"){
    if (Number(timeNumber) > 1){
      modalDialog.style.display = "block"
      modalBody.textContent = "請輸入正確時間";
      return;
    };
  };

  if (!timeNumberIsValidation){
    modalDialog.style.display = "block"
    modalBody.textContent = "服務時長欄位請輸入數字";
    return;
  };
  if (!originPriceIsValidation){
    modalDialog.style.display = "block"
    modalBody.textContent = "原價欄位請輸入數字";
    return;
  };

  let updateAllData = {
    orignPrice: priceOrgin,
    discountPrice: priceDiscount,
    discountBeginDate: priceDiscountBeginDate,
    discountEndDate: priceDiscountEndDate,
    timeNumbers: timeNumber,
    timeSliceUnit: timeSliceValue,
    timeSettingCategory: "特定時間範圍，每日幾點到幾點",
    timeSettingBegintime: timeSelectBeginTime,
    timeSettingEndtime: timeSelectEndTime,
    timeSettingBegindate: timeSelectBeginDate,
    timeSettingEnddate: timeSelectEndDate,
    membersData: membersData
  };

  const token = csrfElement[0].defaultValue;
  update.style.display = "none";
  updating.style.display = "block";
  fetch("/calendar/setting/", {
    method:"POST",
    headers:{
      "X-CSRFToken": token
    },
    body: JSON.stringify(updateAllData)
  }).then(resp => (resp.json())).then(
    data =>{
      if (data.ok){
        update.style.display = "block";
        updating.style.display = "none";
        location.reload();
      }else{
        if (data.msg === "日期重複"){
          modalDialog.style.display = "block"
          modalBody.textContent = "起訖日期和已設定的預約日期重疊，請重新設定";
          update.style.display = "block";
          updating.style.display = "none";
        }
      }
    }
  )
})


get_members_info()

function get_members_info(){
  fetch("/members/get_members_info/").then(
    resp => (resp.json())
  ).then(
    data => {
      if (data.data){
        membersData = data.data;

      }else{
        location.href = "/";
      }
    }
  )
}

closeIcon.addEventListener("click", event => {
  modalDialog.style.display = "none";
})

btnClose.addEventListener("click", event => {
  modalDialog.style.display = "none";
})