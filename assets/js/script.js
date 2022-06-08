//declare html variables
var search = document.getElementById("search");
var citySearchEl = document.getElementById("user-form");
var todayContainer = document.getElementById("today-container");
var forecastContainer = document.getElementById("forecast-container");
var cityBox = document.getElementById("city-box");
var passCity = document.getElementsByClassName("searchCity");

//save array
var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];


//form handler

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = search.value.trim().toLowerCase();
    
    if (cityName) {
        getWeatherInfo(cityName);
        search.value = "";
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
      search.placeholder = "Error: City Not found.";
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    
  });
};

//pick out information from api and call 2nd api
var showWeather = function(response){
  var lon = response.city.coord.lon;
  var lat = response.city.coord.lat;
  var city = response.city.name;
  //save the city to the array
  
  saveCities(city);
  displayCities();
  //fetch weather api via coordinants
  var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=en&units=imperial&appid=42bd6e08d7e2ce3a0832c24d332bfd1e`
    fetch(uviURL)
    .then(function(resp) {
      if (resp.ok){
        resp.json().then(function(data) {

          //current weather information
          var dt = new Date(data.current.dt * 1000);
          var windCurrent = parseInt(data.current.wind_speed);
          var tempCurrent = parseInt(data.current.temp);
          todayContainer.innerHTML = `<h4 class="card-title p-2">${response.city.name} (${dt.toDateString()}) <img 
          src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt="${data.current.weather[0].description}"/></h2>
          <p>Temp: ${tempCurrent}&deg;F</p>
          <p>Wind: ${windCurrent} MPH</p>
          <p>Humidity: ${data.current.humidity}%</p>
          <p>UV Index: <span id="colorful-uvi">${data.current.uvi}</span></p>`;
          //uvi colors

          colorUv(data);
          //5 day forecast loop
          
          forecastContainer.innerHTML = data.daily
            .map((day, idx) => {
              if (idx > 0 && idx < 6) {
                var wind = parseInt(day.wind_speed);
                var temp = parseInt(day.temp.max);
                var dt = new Date(day.dt * 1000);
                return ` 
                  <div class="card">
                    <p>(${dt.toDateString()})</p>
                    <p> <img 
                    src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}"/></p>
                    <p>Temp: ${temp}&deg;F</p>
                    <p>Wind: ${wind}mph</p>
                    <p>Humidity: ${day.humidity}%</p>
                  </div>`
              }
        }).join('')
      }
    )}
  });
}

// //UVI Color Coding
var colorUv = function(data){
            var uvi = parseFloat(data.current.uvi);
            var colorful = document.getElementById("colorful-uvi");
            
            if(uvi <= 2){
              colorful.classList = "colorful-uvi green p-1 rounded";
            } else if(uvi > 2 && uvi < 6) {
              colorful.classList = "colorful-uvi yellow p-1 rounded";
            } else if(uvi > 5 && uvi < 8) {
              colorful.classList = "colorful-uvi orange p-1 rounded";
            } else if(uvi > 7 && uvi < 11) {
              colorful.classList = "colorful-uvi red p-1 rounded";
            } else {
              colorful.classList = "colorful-uvi fuchsia p-1 rounded";
            }
          };
// var colorUv = function(data){
//   var uvi = parseFloat(data.current.uvi);
//   console.log(colorful.textContent());
//   if(uvi <= 2){
//     colorful.classList = "colorful-uvi green";
//   } else if(uvi > 2 && uvi < 6) {
//     colorful.classList = "colorful-uvi yellow";
//   } else if(uvi > 5 && uvi < 8) {
//     colorful.classList = "colorful-uvi orange";
//   } else {
//     colorful.classList = "colorful-uvi red";
//   }
// };

//save cities
var saveCities = function(cityName) {
  if(searchedCities.includes(cityName)){
      let index = searchedCities.indexOf(cityName);
      searchedCities.splice(index,1);
  } 
    searchedCities.push(cityName);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    
};

//Click Function handler for weather buttons
var cityClickFunction = function(){
  var chunk = this.textContent;
  getWeatherInfo(chunk);
};

// //display cities function
var displayCities = function() {
    cityBox.innerHTML = "";
    var lastTen = searchedCities.slice(-10).reverse();
    for (var i = 0; i < lastTen.length; i++) {
      var singleCity = lastTen[i];
      
        //create  container for each city searched
        var cityEl = document.createElement("div");
        cityEl.classList = "cityEl button list-item flex-row";
        cityEl.innerHTML = `<p class="searchCity">${singleCity}</p>`;
        cityBox.appendChild(cityEl);
        cityEl.addEventListener("click", cityClickFunction);
        cityEl.style.textTransform="capitalize";
    }
    
    
};

//display cities on page
displayCities();




//event listeners
citySearchEl.addEventListener("submit", formSubmitHandler);