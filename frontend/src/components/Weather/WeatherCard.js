import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="weather-card one">
            <div className="top">
              <div className="wrapper">
                <h1 className="heading">{data.weather[0].main}</h1>
                <h3 className="location">{data.name}</h3>
                <p className="temp">
                  <span className="temp-value">{Math.round(data.main.temp)}</span>
                  <span className="deg">0</span>
                  <span className="temp-type">C</span>
                </p>
              </div>
            </div>
            <div className="bottom">
              <div className="wrapper">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;