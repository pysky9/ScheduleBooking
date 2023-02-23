const timeSettingbyMember = document.querySelector("#time-setting");
const timeSettingRecord = document.querySelector("#time-setting-record");
const linkToLine = document.querySelector("#link-line");

timeSettingbyMember.addEventListener("click", event => {
    location.href = `/members/store_setting/${storeName}`;
})

timeSettingRecord.addEventListener("click", event => {
    location.href = `/calendar/time_setting_records/${storeName}`;
})

linkToLine.addEventListener("click", event => {
    location.href = `/line/channel_setting/${storeName}`;
})