const redirectToStoreSetting = document.querySelector("#redirect-store-setting");
const lineToLine = document.querySelector("#link-to-line");
const storeTimeSetting = document.querySelector("#store-time-setting");
const redirectSchedule = document.querySelector(".redirect-schedule");

redirectToStoreSetting.addEventListener("click", event => {
    location.href = `/members/store_setting/${storeName}`;
})

lineToLine.addEventListener("click", event => {
    location.href = `/line/channel_setting/${storeName}`;
})

storeTimeSetting.addEventListener("click", event => {
    location.href = `/members/store_setting/${storeName}`;
})

redirectSchedule.addEventListener("click", event => {
    location.href = `/calendar/booked_calendar/${storeName}`;
})