const tableBody = document.querySelector("tbody");
const loading = document.querySelector("#loading");
const modifiedDialogWindow = document.querySelector("#update-modal");
const closeModifiedWindow = document.querySelector("#close-update");
const saveModifiedWindow = document.querySelector("#save-change");
const timeSliceInfo = document.querySelector(".time-slice-info");
const launchDiscount = document.querySelector("#launch-discount");
const closeDiscount = document.querySelector("#close-discount");
const discountBlock = document.querySelector(".discount");
const timeSliceElement = document.querySelector(".time-select-slice");
const timeId = document.querySelector(".time-id");
const inputCorrectColor = document.querySelectorAll("#correct-color");
const removeErrMsg = document.querySelector(".background");
const csrfElement = document.getElementsByName("csrfmiddlewaretoken");
const changing = document.querySelector("#changing");
const deleteModalWindow = document.querySelector("#delete-modal");
const deleteInfoSpan = document.querySelector(".delete-info");
const closeDeleteModalWidow = document.querySelector("#close-delete");
const deleteBookingTimeData = document.querySelector("#deleted-data");
const deleting = document.querySelector("#deleting");

let timeSliceValue;

getMerchantTimeSlots();

function getMerchantTimeSlots(){
    fetch("/calendar/fetch_merchant_time_slots/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                let timeSettings = data.time_setting;
                let timePricings = data.time_pricing;
                renderMerchantTimeSlots(timeSettings, timePricings)
            }else if (!(data.ok && data.data.length)){
                renderNoRecords();
            }
            loading.style.display = "none";
        }
    )
};

closeModifiedWindow.addEventListener("click", event => {
    modifiedDialogWindow.style.display = "none";
});

closeDeleteModalWidow.addEventListener("click", event => {
    deleteModalWindow.style.display = "none";
});

saveModifiedWindow.addEventListener("click", event => {
    const token = csrfElement[0].defaultValue;
    const timeIdElement = document.querySelector(".time-id");
    let timeId = timeIdElement.textContent;
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
    const numberPattern = /^[0-9]+$/;
    const timeNumberIsValidation = numberPattern.test(timeNumber);
    const originPriceIsValidation = numberPattern.test(priceOrgin);
    const discountPriceIsValidation = numberPattern.test(priceDiscount);

    if (beginDate > endDate){
        timeSelectEndDateElement.style.border = "1px solid red";
        timeSelectEndDateElement.style.color = "red";
        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "結束日期要大於開始日期";
        saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeSelectBeginDate){
        timeSelectBeginDateElement.style.border = "1px solid red";
        timeSelectBeginDateElement.style.color = "red";
        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeSelectEndDate){
        timeSelectEndDateElement.style.border = "1px solid red";
        timeSelectEndDateElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeSelectBeginTime){
        timeSelectBeginTimeElement.style.border = "1px solid red";
        timeSelectBeginTimeElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        timeSelectEndTimeElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeSelectEndTime){
        timeSelectEndTimeElement.style.border = "1px solid red";
        timeSelectEndTimeElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        timeSelectEndTimeElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeNumber){
        timeNumberElement.style.border = "1px solid red";
        timeNumberElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        timeSliceElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!timeSliceValue){
        timeSliceElement.style.border = "1px solid red";
        timeSliceElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "必填";
        timeSliceElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
    };
    if (!priceOrgin){
        priceOrginElement.style.border = "1px solid red";
        priceOrginElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "請輸入價錢";
        priceOrginElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (priceDiscount){
        if (!priceDiscountBeginDate){
            priceDiscountBeginDateElement.style.border = "1px solid red";
            priceDiscountBeginDateElement.style.color = "red";
    
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請選取開始日期";
            priceDiscountBeginDateElement.insertAdjacentElement("afterend", msg);
            removeErrMsg.style.display = "block";
            return;
        }else if (!priceDiscountEndDate){
            priceDiscountEndDateElement.style.border = "1px solid red";
            priceDiscountEndDateElement.style.color = "red";
    
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請選取結束日期";
            priceDiscountEndDateElement.insertAdjacentElement("afterend", msg);
            removeErrMsg.style.display = "block";
            return;
        }
        if (!discountPriceIsValidation){
            priceDiscountElement.style.border = "1px solid red";
            priceDiscountElement.style.color = "red";
    
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請輸入數字";
            priceDiscountElement.insertAdjacentElement("afterend", msg);
            removeErrMsg.style.display = "block";
            return;
        }
    };
    if (timeSliceValue === "分"){
        if ( Number(timeNumber) % 30 != 0 || Number(timeNumber) > 1440){
            timeNumberElement.style.border = "1px solid red";
            timeNumberElement.style.color = "red";
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請輸入正確時間";
            saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
            removeErrMsg.style.display = "block";
        return;
        }
    };

    if (timeSliceValue === "小時"){
        if (Number(timeNumber) > 24){
            timeNumberElement.style.border = "1px solid red";
            timeNumberElement.style.color = "red";
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請輸入正確時間";
            saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
            removeErrMsg.style.display = "block";
            return;
        };
    };

    if (timeSliceValue === "日"){
        if (Number(timeNumber) > 24){
            timeNumberElement.style.border = "1px solid red";
            timeNumberElement.style.color = "red";
            const msg = document.createElement("label");
            msg.className = "msg";
            msg.style.color = "red";
            msg.textContent = "請輸入正確時間";
            saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
            removeErrMsg.style.display = "block";
            return;
        };
    };

      // 判斷欄位是否為數字

    if (!timeNumberIsValidation){
        timeNumberElement.style.border = "1px solid red";
        timeNumberElement.style.color = "red";
        const timeSliceInfo = document.querySelector(".time-slice-info");
        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "請輸入數字";
        timeSliceInfo.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };
    if (!originPriceIsValidation){
        priceOrginElement.style.border = "1px solid red";
        priceOrginElement.style.color = "red";

        const msg = document.createElement("label");
        msg.className = "msg";
        msg.style.color = "red";
        msg.textContent = "請輸入數字";
        priceOrginElement.insertAdjacentElement("afterend", msg);
        removeErrMsg.style.display = "block";
        return;
    };


    let updateAllData = {
        timeId: timeId,
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
    };
    saveModifiedWindow.style.display = "none";
    changing.style.display = "block";
    fetch("/calendar/update_merchant_time_slots/", {
        method: "POST",
        headers: {
            "X-CSRFToken": token
        },
        body: JSON.stringify(updateAllData)
    }).then(resp => (resp.json())).then(
        data => {
            if(data.ok){
                saveModifiedWindow.style.display = "block";
                changing.style.display = "none";
                modifiedDialogWindow.style.display = "none";
                location.reload();
            }else{
                if (data.msg === "日期重複"){
                    const msg = document.createElement("label");
                    msg.className = "msg";
                    msg.style.color = "red";
                    msg.textContent = "起訖日期和已設定的預約日期重疊，請重新設定";
                    saveModifiedWindow.insertAdjacentElement("beforebegin", msg);
                    removeErrMsg.style.display = "block";
                    saveModifiedWindow.style.display = "block";
                    changing.style.display = "none";
                }
            }
        }
    )
});

deleteBookingTimeData.addEventListener("click", event => {
    const timeId = document.querySelector(".delete-info").textContent;
    deleteBookingTimeData.style.display = "none";
    deleting.style.display = "block";
    fetch("/calendar/delete_merchant_time_slots/",{
        method: "POST",
        body: JSON.stringify({timeId: timeId})
    }).then(resp => (resp.json())).then(
        data => {
            if (data.ok){
                deleteBookingTimeData.style.display = "block";
                deleting.style.display = "none";
                deleteModalWindow.style.display = "none";
                location.reload();
            }
        }
    )
});

inputCorrectColor.forEach(inputColor => {
    inputColor.addEventListener("click", event => {
        inputColor.style.border = "1px solid gray";
        inputColor.style.color = "black";
    })
});

removeErrMsg.addEventListener("click", event => {
    const msg = document.querySelector(".msg");
    msg.remove()
    removeErrMsg.style.display = "none";
});

timeSliceElement.addEventListener("change", event => {
  timeSliceValue = event.target.value;
  if (timeSliceValue === "分"){
    timeSliceInfo.style.display = "block";
  }else{
    timeSliceInfo.style.display = "none";
  }
});

launchDiscount.addEventListener("click", event => {
    discountBlock.style.display = "block";
  });
  
closeDiscount.addEventListener("click", event => {
const discountElement = document.querySelector(".price-discount");
if (discountElement.value){
    discountElement.value = "";
}
discountBlock.style.display = "none";
});

function renderMerchantTimeSlots(timeSettings, timePricings){
    for(let i=0; i < timeSettings.length; i++){
        const trContainer = document.createElement("tr");

        const settingNumElement = document.createElement("td");
        settingNumElement.textContent = `${timeSettings[i].time_setting_id}`;
        trContainer.appendChild(settingNumElement);

        const beginDateElement = document.createElement("td");
        beginDateElement.textContent = `${timeSettings[i].begin_date}`;
        trContainer.appendChild(beginDateElement);

        const endDateElement = document.createElement("td");
        endDateElement.textContent = `${timeSettings[i].end_date}`;
        trContainer.appendChild(endDateElement);

        const beginTimeElement = document.createElement("td");
        beginTimeElement.textContent = `${timeSettings[i].begin_time}`;
        trContainer.appendChild(beginTimeElement);

        const endTimeElement = document.createElement("td");
        endTimeElement.textContent = `${timeSettings[i].end_time}`;
        trContainer.appendChild(endTimeElement);

        const serviceIntervalElement = document.createElement("td");
        serviceIntervalElement.textContent = `${timeSettings[i].service_interval}`;
        trContainer.appendChild(serviceIntervalElement);

        const originPriceElement = document.createElement("td");
        originPriceElement.textContent = `${timePricings[i].origin_price}`;
        trContainer.appendChild(originPriceElement);

        const discountPriceElement = document.createElement("td");
        if (!timePricings[i].discount_price.length){
            discountPriceElement.textContent = "未設定";
        }else{
            discountPriceElement.textContent = `${timePricings[i].discount_price}`;
        };
        trContainer.appendChild(discountPriceElement);

        const discountBeginDateElement = document.createElement("td");
        if (!timePricings[i].discount_begin_date.length){
            discountBeginDateElement.textContent = "未設定";
        }else{
            discountBeginDateElement.textContent = `${timePricings[i].discount_begin_date}`;
        };
        trContainer.appendChild(discountBeginDateElement);

        const discountEndDateElement = document.createElement("td");
        if (!timePricings[i].discount_end_date.length){
            discountEndDateElement.textContent = "未設定";
        }else{
            discountEndDateElement.textContent = `${timePricings[i].discount_end_date}`;
        };
        trContainer.appendChild(discountEndDateElement);

        //modified button
        const modifiedElement = document.createElement("td");
        const modifiedButton = document.createElement("button");
        modifiedButton.setAttribute("type", "button");
        modifiedButton.className = "btn btn-primary";
        modifiedButton.textContent = "修改";
        modifiedElement.appendChild(modifiedButton);
        trContainer.appendChild(modifiedElement);
        modifiedButton.addEventListener("click", event=>{
            modifiedDialogWindow.style.display = "block";
            timeId.textContent = `${timeSettings[i].time_setting_id}`;
        });

        const cancelElement = document.createElement("td");
        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button");
        cancelButton.className = "btn btn-danger";
        cancelButton.textContent = "刪除";
        cancelElement.appendChild(cancelButton);
        trContainer.appendChild(cancelElement);
        cancelButton.addEventListener("click", event => {
            deleteModalWindow.style.display = "block";
            deleteInfoSpan.textContent = `${timeSettings[i].time_setting_id}`
        });

        tableBody.appendChild(trContainer);
    }
};

function renderNoRecords(){
    const trElement = document.createElement("tr");
    const tdElement = document.createElement("td");
    tdElement.setAttribute("colspan", "12");
    tdElement.textContent = "尚未設定預約時段";
    trElement.appendChild(tdElement);
    tableBody.appendChild(trElement);
};
