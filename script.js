const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
    const city = cityInput.value;

    console.log("City entered:", city);
});
