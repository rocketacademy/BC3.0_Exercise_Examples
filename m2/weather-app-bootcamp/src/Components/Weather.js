import React from "react";
import axios from "axios";
import Graph from "./Graph";

// create graph data arrays
let first = [];
let second = [];
let third = [];
let fourth = [];
let master = [];

export default class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: "",
      currCity: "",
      currTemp: 0,
      currWeather: [],
      projectedWeather: [],
    };
  }

  handelSubmit = () => {
    this.callAPI(this.state.city);
    this.setState({
      city: "",
    });
  };

  getHourlyAndDaily = ({ lat, lon }) => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API}`
      )
      .then((response) => {
        this.setState({
          projectedWeather: response.data.list,
        });

        // fill graph data
        for (let i = 0; i < response.data.list.length; i++) {
          const obj = {
            high: response.data.list[i].main.temp_max,
            low: response.data.list[i].main.temp_min,
            name: `${
              response.data.list[i].weather[0].description
            } \n ${response.data.list[i].dt_txt.slice(4, 16)}`,
          };
          if (i < 9) {
            first.push(obj);
          } else if (i < 18) {
            second.push(obj);
          } else if (i < 27) {
            third.push(obj);
          } else if (i < 36) {
            fourth.push(obj);
          }
        }
        master.push(first, second, third, fourth);
      });
  };

  callAPI = (city) => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.REACT_APP_WEATHER_API}`
      )
      .then((response) => {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      })
      .then((data) => {
        this.getHourlyAndDaily({ lat: data.lat, lon: data.lon });

        return axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`
        );
      })
      .then((response) => {
        this.setState({
          currTemp: response.data.main.temp,
          currWeather: response.data.weather,
          currCity: response.data.name,
        });
      });
  };

  render() {
    return (
      <div>
        <h6>Please insert a city in the input below</h6>
        <input
          type="text"
          value={this.state.city}
          name="city"
          placeholder="Insert city name"
          onChange={(e) => this.setState({ city: e.target.value })}
        />
        <button onClick={this.handelSubmit}>Submit</button>

        {this.state.currCity !== "" ? (
          <div>
            <h3>City: {this.state.currCity}</h3>
            <p>Temperature: {this.state.currTemp}</p>
            <p>Current Weather: </p>
            {this.state.currWeather.map((element, index) => (
              <p key={index}>
                {element.main} -- {element.description}
              </p>
            ))}
          </div>
        ) : null}
        <div className="Container">
          {this.state.projectedWeather.length > 0
            ? this.state.projectedWeather.map((time, index) => (
                <div className="Element" key={index}>
                  <p>{time.dt_txt}</p>
                  <p>Temperature: {time.main.temp}</p>

                  <p>Current Weather:</p>
                  {time.weather.map((element, i) => (
                    <p key={i}>
                      {element.nain} -- {element.description}
                    </p>
                  ))}
                </div>
              ))
            : null}
        </div>
        {/* Use graph data arrays */}
        {master.length > 0 &&
          master.map((period, i) => (
            <div key={i}>
              <h3>
                Next {i * 24} - {i * 24 + 24} hours
              </h3>
              <Graph data={period} />
            </div>
          ))}
      </div>
    );
  }
}
