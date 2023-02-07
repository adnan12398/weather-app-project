// the api link and my key
const weatherApi = "http://api.openweathermap.org"
const ApiKey = "d8da51c4f949bb935233bc42bd7cd4ad"

let searchInput = $("#search-input")
let searchForm = $("#search-form")
let todayContainter = $('#today')
let forecastContainer = $('#forecast')


// get current weather of location chosen by user
function renderWeather(city, data){
    let date = moment().format('D/M/YYYY');
    let temp = data['main']['temp'];
    let windspeed = data['wind']['speed'];
    let humidity = data['main']['humidity'];

    let weatherIcon = $('<img>')
    let card = $('<div>');
    let cardBody = $('<div>');
    
    let iconLink = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    let description = data.weather[0].description;

    let heading = $('<h2>');
    let tempEl = $('<p>');
    let wind = $('<p>');
    let humidityEl = $('<p>');

    card.attr('class','card');

    cardBody.attr('class','card-body');

    card.append(cardBody);

    heading.attr('class', 'h3 card-title');
    tempEl.attr('class', 'card-text');
    wind.attr('class', 'card-text');
    humidityEl.attr('class', 'card-text');

    heading.text(`${city} (${date}) `);
    weatherIcon.attr('src', iconLink);
    heading.append(weatherIcon);

    tempEl.text(`Temp: ${temp} C`);
    wind.text(`Wind: ${windspeed} KPH`);
    humidityEl.text(`Humidity ${humidity} %`);
    cardBody.append(heading, tempEl,wind,humidityEl);

    todayContainter.html('');
    todayContainter.append(card);
}

function renderForecast(data){

    let headingCol = $('<div>');
    let heading = $('<h4>');

    headingCol.attr('class', 'col-12');
    heading.text('5-day forecast');
    headingCol.append(heading);

    forecastContainer.html('')
    forecastContainer.append(headingCol)

    let futureForecast = data.filter(function(forecast){
        return forecast.dt_txt.includes('5')
    })

      for(let index = 0; index < futureForecast.length; index++){
      let iconURL = `https://openweathermap.org/img/w/${futureForecast[index].weather[0].icon}.png` 
      
      //let iconDescripton = futureForecast[index].weather[0].description;
      let tempC = futureForecast[index].main.temp;
      let humidity = futureForecast[index].main.humidity;
      let windKPH = futureForecast[index].main.speed;

      let col = $('<div>');
      let card = $('<div>')
      let cardBody = $('<div>');
      let cardTitle = $('<h5>');
      let weatherIcon = $('<img>');
      let tempEl = $('<p>');
      let wind = $('<p>');
      let humidityEl = $('<p>');

      col.append(card);
      card.append(cardBody);
      cardBody.append(cardTitle,weatherIcon,tempEl,wind,humidityEl);

      col.attr('class', "col-md");      
      card.attr('class', 'card bg-primary h-100 text-white');
      cardTitle.attr('class', 'card-title' );
      tempEl.attr('class', "card-text")
      wind.attr('class', "card-text")
      humidityEl.attr('class', "card-text")

      cardTitle.text(moment(futureForecast[index].dt_text).format('D/M/YYYY'));
      weatherIcon.attr('src', iconURL);
      tempEl.text(`Temp: ${tempC} C`);
      wind.text(`Wind: ${windKPH} KPH`);
      humidityEl.text(`Humidity ${humidity} %`);
      cardBody.append(heading, tempEl,wind,humidityEl);
    
      forecastContainer.append(col);




    }

}


function getWeather(location){

   let latitide = location.lat;
   let longitude = location.lon;

   let city = location.name;

   let queryWeatherURL = `${weatherApi}/data/2.5/forecast?lat=${latitide}&lon=${longitude}&units=metric&appid=${ApiKey}`
    

    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function(response){
        renderWeather(city, response.list[0])
        renderForecast(response.list);
    })

   


}

// function to get location from user and match it to data from api
function getCoordiantes(search){
    let queryURL = `${weatherApi}/geo/1.0/direct?q=${search}&limit=5&appid=${ApiKey}`;
    
    // getting the data from the api using $.ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        if (!response[0]){
        alert('location cant be found')
        }  else{
            getWeather(response[0])
        }
    })
}




function startSearch(event){

    event.preventDefault();
    let search = (searchInput.val().trim())

    getCoordiantes(search);

     
}

searchForm.on('submit', startSearch)

