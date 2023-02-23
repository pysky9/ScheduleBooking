// const customerBtn = document.querySelector("#customer-btn");
const customerNameElement = document.querySelector("#customer-name");
const customerEmailElement = document.querySelector("#customer-email");
const customerBookingBtn = document.querySelector("#customer-btn");
let customerName = customerNameElement.textContent;
let customerEmail = customerEmailElement.textContent;
let pathName = window.location.pathname;
let storeName = pathName.split("/")[3];



customerBookingBtn.addEventListener("click", event => {
    location.href = `/calendar/views/${storeName}`;
})

