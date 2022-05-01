async function getData () {
  const key = 'b0ac620ec41a9b1fed127c30d863e249'
  const country = 'sweden'
  const city = 'vaxjo'
  try {
    const api = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${key}`
    )
    const response = await api.json()
    return response
  } catch (error) {
    console.log(error)
  }
}

async function rederWeatherData () {
  const data = await getData()
  console.log(data)
  const main = data.weather[0].main
  const celsius = convertToCelsius(data.main.temp)
  const icon = data.weather[0].icon
  const description = data.weather[0].description
  const wind = data.wind.speed

  const body = document.querySelector('body')
  console.log(body)
  const div = `<div class='div-weather'>
  <h5 class='header'>The weather in Växjö now</h5>
  <p class = 'weather-status'>Temperature: ${celsius}&deg;
    <img src="https://openweathermap.org/img/wn/${icon}.png" alt='weather-icon' />
    ${main}
    <br /> Wind speed: ${wind} m/s
    <br /> Description: ${description}
  </p>
</div>
`
  body.innerHTML = div
}

rederWeatherData()

function convertToCelsius (temp) {
  const cell = Math.floor(temp - 273.15)
  return cell
}
