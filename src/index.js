import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

window.onload = () => {
  //Weather APP 
  let root_element = document.getElementById("root");  
  
  class WeatherApp extends React.Component
  {
    constructor(props){
      super(props);
      this.state = {
        location: "",
        weather_status: " ",
        temperature: "--",
        temp_unit: "°C",
        temp_feeling: " ",
        est_temp_min: " ",
        est_temp_max: " "
      }
      this.toggleTempUnit = this.toggleTempUnit.bind(this);
      this.weatherReq = this.weatherReq.bind(this);
      this.handleData = this.handleData.bind(this);
      this.handleConvertFahrenheit = this.handleConvertFahrenheit.bind(this);
      this.handleConvertCelcius = this.handleConvertCelcius.bind(this);
      this.convertToFahrenheit = this.convertToFahrenheit.bind(this);
      this.convertToCelcius = this.convertToCelcius.bind(this);
      this.handleWeatherIcon = this.handleWeatherIcon.bind(this);
    }
    
    handleWeatherIcon(value)
    {
      let weather_status_str = value.toLowerCase();
      let symbol_btn = document.getElementsByClassName("weather_symbols")[0];
      
      switch(weather_status_str)
        {
          case "mist":
          case "smoke":
          case "fog":
          case "haze":
          case "squall":  
          case "clouds":
            symbol_btn.innerHTML = "<i class=\'fas fa-cloud\'></i>";
            symbol_btn.style.color = "lightgrey";
            break;
          case "drizzle":
          case "rain":
            symbol_btn.innerHTML = "<i class=\'fas fa-cloud-rain\'></i>";
            symbol_btn.style.color = "lightgrey";
            break;
          case "dust":   
          case "sand":
          case "ash":  
          case "wind":
            symbol_btn.innerHTML = "<i class=\'fas fa-wind\'></i>";
            symbol_btn.style.color = "lightgrey";
            break;
          case "snow":
            symbol_btn.innerHTML = "<i class=\'fas fa-snowflake\'></i>"
            symbol_btn.style.color = "white";
            break;
          case "tornado":  
          case "thunderstorm":
            symbol_btn.innerHTML = "<i class=\'fas fa-poo-storm\'></i>";
            symbol_btn.style.color = "grey";
            break;
          case "clear":
            symbol_btn.innerHTML = "<i class=\'fas fa-cloud-sun\'></i>"
            symbol_btn.style.color = "yellow";
            break;
          default:
            symbol_btn.innerHTML = " ";
            symbol_btn.style.color = "black";
            break;
        }
      
    }
    
    convertToFahrenheit(value)
    {
      let n = Number(value); 
      let fahrenheit = (n * (9/5)) + 32; //( °C × 9/5) + 32
      fahrenheit = fahrenheit.toFixed(2);
      fahrenheit = String(fahrenheit);
      return fahrenheit;
    }
    
    convertToCelcius(value)
    {
      let n = Number(value);
      let celcius = (n - 32) * (5/9);//(°F − 32) × 5/9
      celcius = celcius.toFixed(2);
      celcius = String(celcius);
      return celcius;
    }
    
    handleConvertFahrenheit()
    {
      let temp = this.state["temperature"];
      let feel = this.state["temp_feeling"];
      let est_min = this.state["est_temp_min"];
      let est_max = this.state["est_temp_max"];
      
      temp = this.convertToFahrenheit(temp);
      feel = this.convertToFahrenheit(feel);
      est_min = this.convertToFahrenheit(est_min);
      est_max = this.convertToFahrenheit(est_max);
      
      this.setState({
        location: this.state.location,
        weather_status: this.state.weather_status,
        temperature: temp,
        temp_unit: "°F",
        temp_feeling: feel,
        est_temp_min: est_min,
        est_temp_max: est_max
      });
      
    }
    
    handleConvertCelcius()
    {
      
      let temp = this.state["temperature"];
      let feel = this.state["temp_feeling"];
      let est_min = this.state["est_temp_min"];
      let est_max = this.state["est_temp_max"];
      
      temp = this.convertToCelcius(temp);
      feel = this.convertToCelcius(feel);
      est_min = this.convertToCelcius(est_min);
      est_max = this.convertToCelcius(est_max);
      
      this.setState({
        location: this.state.location,
        weather_status: this.state.weather_status,
        temperature: temp,
        temp_unit: "°C",
        temp_feeling: feel,
        est_temp_min: est_min,
        est_temp_max: est_max
      });
      
    }
    
    handleData(weatherData)
    {
      let description = weatherData["weather"][0]["main"];
      let city = weatherData["name"] + ", " + weatherData["sys"]["country"];
      let temp = weatherData["main"]["temp"];
      let feel = weatherData["main"]["feels_like"];
      let max = weatherData["main"]["temp_max"];
      let min = weatherData["main"]["temp_min"];
      
      this.setState({
        location: city,
        weather_status: description,
        temperature: temp,
        temp_unit: this.state.temp_unit,
        temp_feeling: feel,
        est_temp_min: min,
        est_temp_max: max
      });
      this.handleWeatherIcon(description);
    }
    
     async getWeather(city) {
    try {
        
        let unit = "";
         
        if(this.state.temp_unit == "°C")
          {
            unit = "metric";
          }
        else
          {
            unit = "imperial";
          }
        console.log(unit);
        let responseUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=ccf077e48a163af71c92014dbbdea1cb`;
        let response = await fetch(responseUrl, {mode: 'cors'});
        let data = await response.json();
        this.handleData(data);
    } catch(err) {
        console.error(err);
      }
    }
    
    
    
    weatherReq(){
      let city_value = document.getElementsByClassName("weather_input")[0].value;
      document.getElementsByClassName("weather_input")[0].value = "";
      if(city_value != " ")
        {
          this.getWeather(city_value); 
        }
    }
   
    toggleTempUnit(){
      let celcius_btn = document.getElementsByClassName("celcius_button")[0];
      let fahrenheit_btn = document.getElementsByClassName("fahrenheit_button")[0];
      if(this.state.weather_status == " ")
        {
          this.state.temp_unit == "°C" ? this.setState({temp_unit: "°F"}): this.setState({temp_unit: "°C"});
          celcius_btn.classList.toggle("selected_temp");
          fahrenheit_btn.classList.toggle("selected_temp");
        }
      else
        {
          this.state.temp_unit == "°C" ? this.handleConvertFahrenheit() : this.handleConvertCelcius();
          celcius_btn.classList.toggle("selected_temp");
          fahrenheit_btn.classList.toggle("selected_temp");
        }
    }
    
    render()
    {
      return(
        <div className="container">
          
          <div className="container_header">
            <input type="text" className="weather_input" />
            <button onClick={this.weatherReq}className="weather_check_button">
              <i className="fas fa-search-location"></i>
            </button>
          </div>
          
          <div className="container_body">
            <div className="cb_box1">
              <button onClick={this.componentDidMount} className="weather_symbols"></button><h2>{this.state.weather_status}</h2>
            </div>
            <div className="cb_box2">
              <h1>{this.state.temperature} {this.state.temp_unit}</h1>
            </div>
            <div className="cb_box3">
              <h2>{this.state.location}</h2>
            </div>
            <div className="cb_box4">
              <h3>Feels like: {this.state.temp_feeling} {this.state.temp_unit}</h3>
            </div>
            <div className="cb_box5">
              <h3>Min: {this.state.est_temp_min} {this.state.temp_unit}</h3><h3>Max: {this.state.est_temp_max} {this.state.temp_unit}</h3>
            </div>
          </div>
          
          <div className="container_footer">
            <button onClick={this.toggleTempUnit} className="celcius_button selected_temp">Celcsius °C</button>
            <button onClick={this.toggleTempUnit}className="fahrenheit_button">Fahrenheit °F</button>
          </div>
          
       </div>
      );
    }
  }
 ReactDOM.render(<WeatherApp />, root_element);
}















serviceWorker.unregister();
