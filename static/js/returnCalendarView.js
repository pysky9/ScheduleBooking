const navbarbrand = document.querySelector(".navbar-brand");

navbarbrand.addEventListener("click", redirectHomePage);

function redirectHomePage(){
    fetch("/calendar/get_consumer_data/").then(
        response => (response.json())
    ).then(
        data => {
            if (data.ok){
                let storeData = data.data;
                location.href = `/calendar/views/${storeData.storeName}`;
            }
        }
    )
}