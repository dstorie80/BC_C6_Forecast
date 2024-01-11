var btn1 = document.getElementById('search-button');
var searchForm = document.getElementById('search-city');


function getAPI(e) {
    e.preventDefault();
    var city = document.getElementById('city').value;
    var apiKey = '6b5bb3f810a9caf544fed60b3ff3e278';
    var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

    fetch(url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if (data && data.length > 0) {
                localStorage.setItem("geoData", JSON.stringify(data));
                var cityName = data[0].name;
                var lat = data[0].lat;
                var lon = data[0].lon;
                localStorage.setItem("city", cityName);
                localStorage.setItem("lat", lat);
                localStorage.setItem("lon", lon);

                // Make a new fetch request using the lat and lon variables to get the 3-hour forecast
                var threeHourUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial&cnt=8`;
                fetch(threeHourUrl)
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        localStorage.setItem("threeHourForecast", JSON.stringify(data));

                        // Extract the relevant data for the first 3-hour forecast
                        var firstForecast = data.list[0];
                        var temp = firstForecast.main.temp;
                        var windSpeed = firstForecast.wind.speed * 2.237; // Convert wind speed to mph
                        var humidity = firstForecast.main.humidity;
                        var icon = firstForecast.weather[0].icon;
                        const today = moment().format('MMMM Do YYYY');
                        document.querySelector('.date').textContent = '(' + today + ')';

                        // Store the extracted data in local storage
                        localStorage.setItem("threeHourCity", cityName);
                        localStorage.setItem("threeHourTemp", temp);
                        localStorage.setItem("threeHourWindSpeed", windSpeed.toFixed(1)); // Round wind speed to one decimal place
                        localStorage.setItem("threeHourHumidity", humidity);
                        localStorage.setItem("threeHourIcon", icon);

                        document.getElementById("three-hour-city").textContent = cityName;
                        document.getElementById("three-hour-temp").textContent = temp + "°F";
                        document.getElementById("three-hour-wind-speed").textContent = windSpeed.toFixed(1) + " mph";
                        document.getElementById("three-hour-humidity").textContent = humidity + "%";
                        document.getElementById("three-hour-icon").src = `http://openweathermap.org/img/wn/${icon}.png`;

                        console.log(data);

                        
                    });

                // Make a new fetch request using the lat and lon variables to get the 5-day forecast
                var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`;
                fetch(fiveDayUrl)
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        localStorage.setItem("fiveDayForecast", JSON.stringify(data));
                        console.log(data);
                    });
            }
        });
}

function populate3HourForecast() {
    // Retrieve the data from local storage
    var cityName = localStorage.getItem("threeHourCity");
    var temp = localStorage.getItem("threeHourTemp");
    var windSpeed = localStorage.getItem("threeHourWindSpeed");
    var humidity = localStorage.getItem("threeHourHumidity");
    var icon = localStorage.getItem("threeHourIcon");

    // Populate the data into the 3-hour forecast div
    document.getElementById("three-hour-city").textContent = cityName;
    document.getElementById("three-hour-temp").textContent = temp + "°C";
    document.getElementById("three-hour-wind-speed").textContent = windSpeed + " m/s";
    document.getElementById("three-hour-humidity").textContent = humidity + "%";
    document.getElementById("three-hour-icon").src = `http://openweathermap.org/img/wn/${icon}.png`;
}

function createButtonForCity() {
    // Get the history element from the HTML
    var historyEl = document.getElementById('history');
  
    // Get the city name from local storage
    var cityName = localStorage.getItem('city');
    
  
    // Create a new button element
    var buttonEl = document.createElement('button');
    buttonEl.textContent = cityName;
    buttonEl.textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    buttonEl.className = 'hbtn';
  
    // Add a click event listener to the button
    buttonEl.addEventListener('click', function() {
      // Set the city input value to the city name
      document.getElementById('city').value = cityName;
  
      // Call the getAPI function to fetch the weather data
      getAPI(event);
      saveLocalStorage();
      populate3HourForecast();
    });
  
    // Add the button to the history element
    historyEl.appendChild(buttonEl);
  }

  function saveLocalStorage() {
    localStorage.setItem("city", document.getElementById("city").value);
    localStorage.setItem("geoData", JSON.stringify(Array.from(JSON.parse(localStorage.getItem("geoData"))).slice(0, 5)));
    localStorage.setItem("threeHourForecast", JSON.stringify(Array.from(JSON.parse(localStorage.getItem("threeHourForecast"))).slice(0, 8)));
    localStorage.setItem("fiveDayForecast", JSON.stringify(Array.from(JSON.parse(localStorage.getItem("fiveDayForecast"))).slice(0, 40)));
  }
  


btn1.addEventListener('click', function (e) {
    e.preventDefault();
    getAPI(e);
    saveLocalStorage();
    populate3HourForecast();
    createButtonForCity();
});