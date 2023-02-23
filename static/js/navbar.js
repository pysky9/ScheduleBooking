let pathname = window.location.pathname;
let storeName = pathname.split("/")[3];
const logo = document.querySelector("#logo");
const navBarSiteMap = document.querySelector("#navbar-sitemap");
const navBarBookedCalendar = document.querySelector("#navbar-booked-calendar");
const navBarCustomer = document.querySelector("#navbar-customer");
const navBarOrderRecord = document.querySelector("#navbar-order-record");
const navBarSetting = document.querySelector("#navbar-setting");
const logout = document.querySelector("#logout");

logo.addEventListener("click", event => {
    location.href = `/members/sitemap/${storeName}`;
})

navBarSiteMap.addEventListener("click", event => {
    location.href = `/members/sitemap/${storeName}`;
})

navBarBookedCalendar.addEventListener("click", event => {
    location.href = `/calendar/booked_calendar/${storeName}`;
})

navBarCustomer.addEventListener("click", event => {
    location.href = `/members/customer_management/${storeName}`;
})

navBarOrderRecord.addEventListener("click", event => {
    location.href = `/order/order_record/${storeName}`;
})

navBarSetting.addEventListener("click", event => {
    location.href = `/members/store_setting/${storeName}`;
})

logout.addEventListener("click", event => {
  fetch("/members/logout/").then(
    resp => (resp.json())
  ).then(
    data => {
      if (data.ok){
        location.href = "/" ;
      }
    }
  )
})
