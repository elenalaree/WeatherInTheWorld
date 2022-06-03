//declare html variables
var search = document.querySelector("#search")
var todayContainer = document.querySelector("#today-container");
var forecastContainer = document.querySelector("#forecast-container");
var cityBox = document.querySelector("#city-box");
var today = document.createElement("div");
var forecast = document.createElement("div");

//save array
var searchedCities = JSON.parse("searchedCities") || [];
//form handler
var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = search.value.trim();

    if (cityName) {
        getWeatherInfo(cityName);
        search.value = "";
    } else {
        alert("Please enter a city name!");
    }
};
//call api


//pick out information from api


//display information about api


//save cities
var saveCities = function(cityName) {

    
};

//display cities
var displayCities = function(cities, searchTerm) {
    searchedCities = JSON.parse("searchedCities");
    var cityName = searchedCities[i];

    for (var i = 0; i < searchedCities.length; i++) {
        //create  container for each city searched
        var cityEl = document.createElement("a");
        cityEl.classList = "btn list-item flex-row";
        cityEl.setAttribute("href","./html?info=" + );
        cityEl.textContent = cityName;

        cityBox.appendChild(cityEl);
    }
};

//display forecast
    

//display 5 day forecast

