//declare html variables
var search = document.querySelector("#search");
var citySearchEl = document.querySelector("#user-form");
var todayContainer = document.querySelector("#today-container");
var forecastContainer = document.querySelector("#forecast-container");
var cityBox = document.querySelector("#city-box");


//save array
var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];


//form handler

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = search.value.trim();
    
    if (cityName) {
        getWeatherInfo(cityName);
        //saveCities(cityName, infoLink);
        //search.value = "";
        console.log(cityName);
    } else {
        redAlert();
    }
};
// warning function
var redAlert = function(){
    var undo = function(){
        search.classList = "form-input";
    }
    search.classList = "red form-input";
    setTimeout(undo, 500);
}


//call api
var getWeatherInfo = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&lang=en&units=imperial&appid=42bd6e08d7e2ce3a0832c24d332bfd1e";
  
    // make a request to the url
    fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        showWeather(data);
      });
    } else {
      alert('Error: City Not Found');
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
};



//pick out information from api
var showWeather = function(response){
  console.log(response.city.coord);
  var lon = response.city.coord.lon;
  var lat = response.city.coord.lat;

  var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=en&units=imperial&appid=42bd6e08d7e2ce3a0832c24d332bfd1e`
    fetch(uviURL)
    .then(function(resp) {
      if (resp.ok){
        resp.json().then(function(data) {
          console.log(data);
          var dt = new Date(data.current.dt * 1000);
          todayContainer.innerHTML = `<h4 class="card-title p-2">${response.city.name} (${dt.toDateString()}) <img 
        src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt="${data.current.weather[0].description}"/></h2>
        <p>Temp: ${data.current.temp}&deg;F</p>
        <p>Wind: ${data.current.wind_speed} MPH</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>UV Index: <span>${data.current.uvi}</span></p>`;

        forecastContainer.innerHTML = data.daily
          .map((day, idx) => {
              if (idx > 0 && idx < 6) {
                var dt = new Date(day.dt * 1000);
                console.log(dt);
                return ` 
                <div class="card">
                    <p>(${dt.toDateString()})</p>
                    <p> <img 
                    src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}"/></p>
                    <p>Temp: ${day.temp.max}&deg;</p>
                    <p>Wind: ${day.wind_speed}</p>
                    <p>Humidity: ${day.humidity}</p>
                </div>`
              }
        }).join('')
      }
    )}
  });
}
//display information about api


//save cities
// var saveCities = function(cityName, infoLink) {
//     searchedCities[cityName] = infoLink;
//     localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    
// };

// //display cities
// var displayCities = function(cities, searchTerm) {
//     searchedCities = JSON.parse("searchedCities");
//     var cityName = searchedCities[i];
    
//     for (var i = 0; i < searchedCities.length; i++) {
//         //create  container for each city searched
//         var cityEl = document.createElement("a");
//         cityEl.classList = "button list-item flex-row";
//         cityEl.setAttribute("href","./html?info=" );
//         cityEl.textContent = cityName;
        
//         cityBox.appendChild(cityEl);
//     }
// };

//display forecast


//display 5 day forecast

//event listeners
 citySearchEl.addEventListener("submit", formSubmitHandler);



