



//my api//
function GetCurrentLocation() {
    const locationNow = document.getElementById('CurrentLocation');
    
    let citName = document.getElementById("CityName");
    location.city
    $.ajax({
        url: "https://geolocation-db.com/json/d802faa0-10bd-11ec-b2fe-47a0872c6708",
        jsonpCallback: "callback",
        dataType: "json",
        success: function (location) {
           
            locationNow.innerHTML = location.city + ", " + location.state + " " + location.postal 
          
            citName.innerHTML = location.city
        }
    });

}






const forecast = document.getElementById('weather-forecast');
const currentTem = document.getElementById('current-temp');
const searched = document.getElementById('Searched'); 


//new api not workin//
const API_KEY = 'd2b6ee87e54c05fd0975ee59cf826c34';
function time() {setInterval(() => {
    const time = new Date();
 
   
    let timeEl = document.getElementById('CurrentTime');
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds) +  ' ' +`<span id="am-pm">${ampm}</span>`

    

}, 1000);
}

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=$d2b6ee87e54c05fd0975ee59cf826c34`).then(res => res.json()).then(data => {

        
            showWeatherData(data);
            showWeatherDataCurrentLoc(data)
            
        })

    })
}


function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
  
  

   
   
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            
            currentTem.innerHTML = `
                <div id="citName" class="col citName">
  
                    </div>
            <center>
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            </center>
                    <div class="row temps2">
                <div class="lowTemp">${day.temp.night}&#176;F</div>
                <div class="highTemp">${day.temp.day}&#176;F</div>
                    </div>
                        <div class="row  ">
                            <div style="" class="white col">Humidity: ${humidity}%</div>
                                <div class="white col">💨 ${wind_speed} mph</div>
                                <div class="white col">🌅 ${window.moment(sunrise * 1000).format('HH:mm a')}</div>
                                <div class="white col">🌄 ${window.moment(sunset * 1000).format('HH:mm a')}</div>
                        </div>         
                  
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item weekday">
                <div class="day weekdayTitle">${window.moment(day.dt * 1000).format('ddd')}</div>
               <center>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
               </center>
                        <div class="row temps">
                                <div class="lowTemp col">${day.temp.min}&#176;F</div>
                                <div class="highTemp col">${day.temp.max}&#176;F</div>
                                <div style="padding-top:25px" class="white">Humidity: ${day.humidity}%</div>
                                <div class="white">💨 ${day.wind_speed} mph</div>
                                <div class="white">🌅 ${window.moment(day.sunrise * 1000).format('HH:mm a')}</div>
                                <div class="white">🌄 ${window.moment(day.sunset * 1000).format('HH:mm a')}</div>
                                 
                          </div>
            
            </div>
            
            `
            let input = document.getElementById("searchvalue");
            let citName = document.getElementById("citName");
            citName.innerHTML = input.value
        }
    })


    forecast.innerHTML = otherDayForcast;
    let loc = {
        lat: data.lat,
        long: data.lon
    };
    displayMap(loc);
}
function showWeatherDataCurrentLoc(data) {
    




    data.daily.forEach((day, idx) => {
        if (idx == 0) {
           
            
            
            
            searched.innerHTML = `
   
            
            <div style="height:auto">
                <p id="location" style=""><i style="color:blue" class="fa-solid fa-location-pin"></i> <span id="CurrentLocation"></span></p>
                <div id="current-icon"><center><img  src="http://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"></center></div>
                <div class="day">Current</div>
                <div class="temp">Low - ${day.temp.night}&#176;F</div>
                <div class="temp">High - ${day.temp.day}&#176;F</div>
                <div id="CurrentTime"></div>
            </div>
          
            
            `
           
          
            
            
        }
    })
    GetCurrentLocation();

   
}
import cityData from "../../data/worldcities.js";

document.getElementById("searchbtn").addEventListener("click", search);

function search() {

    const input = document.getElementById("searchvalue");
    
  


    function capitalizeFirstLetter(str) {

       
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalized;
    }

  let loc = getCoordinatesOfCity(capitalizeFirstLetter(input.value));
 
    
    displayMap(loc);
    getWeatherDataSearch(loc)
}

function getCoordinatesOfCity(city) {
  
  let loc = {
    lat: parseFloat(cityData[`${city}`][0].lat),
    long: parseFloat(cityData[`${city}`][0].lng),
  };
  return loc;
}
function displayMap(loc) {
 
    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
  var map = L.map("map").setView([loc.lat, loc.long], 10);
  L.tileLayer(
    "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c54a9f81admshf1332fadb0471bep178f83jsn1f3d387e6db3",
    {
      attribution:
        'Tiles &copy: <a href="https://www.maptilesapi.com/">MapTiles API</a>, Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }
  ).addTo(map);
}

function getWeatherDataSearch(loc) {


    let latitude = loc.lat;
    let longitude = loc.long;
    


    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {

        
        showWeatherData(data);



    })
     };

time();
