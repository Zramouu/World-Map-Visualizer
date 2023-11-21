import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import { fetchWeather } from './components/Weather/weatherService';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import humidityIcon from './components/Weather/Assets/humidity.png';
import windIcon from './components/Weather/Assets/wind.png'

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const initialCenter = {
  lat: 46,
  lng: 17
};

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  // eslint-disable-next-line 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    review: "",
    star: 0
  });
  
  const [viewport, setViewport] = useState({
    lat: initialCenter.lat,
    lng: initialCenter.lng,
    zoom: 4,
  });
  const [viewMode, setViewMode] = useState('pins');
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        setPins(res.data);
        
        // Fetch weather data for each pin
        for (let pin of res.data) {
          const weather = await fetchWeather(pin.lat, pin.long);
          setWeatherData(prevData => ({ ...prevData, [pin._id]: weather }));
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getPins();
  }, []);
  
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = async (id, lat, long) => {
    setViewport({
      lat: lat,
      lng: long,
      zoom: 4,
    });
    
    const data = await fetchWeather(lat, long);
    
    setWeatherData(prevState => ({
      ...prevState,
      [id]: data
    }));
    
    setCurrentPlaceId(id);
  };
  

  const handleAddClick = (e) => {
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();
    
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
        username: currentUsername,
        title: formData.title,
        desc: formData.review,
        rating: formData.star,
        lat: newPlace.lat,
        long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    setIsLoggedIn(false); 
    myStorage.removeItem("user");
  };

  const handleRegistrationSuccess = () => {
    setShowRegister(false);
    setShowLogin(true);
};

  return (
<div className='App'>

      <div className="toggleButtons">
        <button onClick={() => setViewMode('pins')}>View Pins</button>
        <button onClick={() => setViewMode('weather')}>View Weather</button>
      </div>
      <LoadScript 
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      language="en"
      >
      <GoogleMap
    className={`${showLogin || showRegister ? 'blurred-map' : ''}`}
    mapContainerStyle={containerStyle}
    center={{ lat: viewport.lat, lng: viewport.lng }}
    zoom={viewport.zoom}
    onDblClick={viewMode === 'pins' ? handleAddClick : null}
>
          {pins.map(p => (
  <React.Fragment key={p._id}>
    <Marker 
      position={{ lat: p.lat, lng: p.long }}
      onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
      transitionDuration="200"
    />

    {p._id === currentPlaceId && viewMode === 'pins' && (
      <InfoWindow
        position={{ lat: p.lat, lng: p.long }}
        onCloseClick={() => setCurrentPlaceId(null)}
      >
       <div className="card">
    <div className="section">
      <label className="label">
      <i class="fi fi-rs-archway "></i><span class="destination-text">Destination</span>
      </label>
      <h4 className="place" style={{   
      fontSize: "16px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color:"black",
      verticalAlign: "middle", }}>
      {p.title}
      </h4>

    </div>
    <div className="section">
      <label className="label">
      <i class="bi bi-pen-fill "></i><span class="review-text">Review</span>
      </label>
      <p className="desc">{p.desc}</p>
    </div>
    <div className="section">
      <label className="label">
      <i class="bi bi-hand-thumbs-up-fill"></i><i class="bi bi-hand-thumbs-down-fill"></i><span class="rating-text">Rating</span>
      </label>
      <div className="stars">
      {Array.from({ length: 5 }).map((_, index) => (
          index < p.rating ? 
              <i key={index} className="bi bi-star-fill star filled-star"></i> :
              <i key={index} className="bi bi-star star"></i>
      ))}
    </div>
    </div>
    <div className="section">
      <label className="label">
      <i class="bi bi-person-circle"></i><span class="info-text">Information</span>
      </label>
      <span className="username" 
    style={{   
    fontSize: "16px",
    fontFamily: "Arial, Helvetica, sans-serif",
    color:"black",
    verticalAlign: "middle",
    }}
    >Created by <b style={{   
      fontSize: "16px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color:"black",
      verticalAlign: "middle",
      }}
      >{p.username}</b>
    </span>
    <span className="date">
    <i className="bi bi-clock" style={{ marginRight: '5px', color:"black",}}> </i>
  <span style={{ color: 'black', fontFamily: "Arial, Helvetica, sans-serif", }}>
    {format(p.createdAt)}
  </span>
</span>


    </div>
  </div>
</InfoWindow>
    )}

    {p._id === currentPlaceId && viewMode === 'weather' && weatherData[p._id] && (
      <InfoWindow
        position={{ lat: p.lat, lng: p.long }}
        onCloseClick={() => setCurrentPlaceId(null)}
      >
        <div className="weather-card">
        <div className="city-name">{weatherData[p._id]?.name}</div>
        <img className="weather-icon" src={`http://openweathermap.org/img/wn/${weatherData[p._id]?.weather[0].icon}.png`} alt="weather icon" />
        <div className="temperature">{weatherData[p._id]?.main.temp}°C</div>
        <div className="humidity">
            <img src={humidityIcon} alt="Humidity" /> 
            {weatherData[p._id].main.humidity}% Humidity
          </div>
          <div className="wind-speed">
            <img src={windIcon} alt="Wind Speed" />
            {weatherData[p._id].wind.speed} km/h Wind Speed
          </div>
    </div>

      </InfoWindow>
    )}
  </React.Fragment>
))}

{newPlace && (
  <InfoWindow

    position={{ lat: newPlace.lat, lng: newPlace.long }}
    onCloseClick={() => setNewPlace(null)}
    offsetLeft={-3.5 * viewport.zoom}
    offsetTop={-7 * viewport.zoom}
  >
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{
          fontSize: "15px",
          color: "#018749",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          letterSpacing: "0.5px",
          outline: "none"
        }}>
          Title
        </label>
        <input
          placeholder='Enter a title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          autoFocus
        />
        <label style={{
          fontSize: "15px",
          color: "#018749",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          letterSpacing: "0.5px",
          outline: "none"
        }}>
          Review
        </label>
        <textarea 
          placeholder="Share your thoughts!"
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
        />
        <label style={{
          fontSize: "15px",
          color: "#018749",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          letterSpacing: "0.5px",
          outline: "none"
        }}>
          Rating
        </label>
        <select className='customSelect'
          value={formData.star}
          onChange={(e) => setFormData({ ...formData, star: e.target.value })}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button className='submitButton' type="submit">
          <i className="bi bi-pin-map-fill"></i> Add Pin
        </button>
      </form>
    </div>
  </InfoWindow>
)}

        </GoogleMap>
      </LoadScript>
      {currentUsername ? (
      <button className="button logout" onClick={handleLogout}>
        Log out
      </button>
    ) : (
      <div className="buttons">
        <button className="button login" onClick={() => setShowLogin(true)}>
          Log in
        </button>
        <button
          className="button register"
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>
      </div>
    )}
    {showRegister && <Register setShowRegister={setShowRegister} onRegistrationSuccess={handleRegistrationSuccess} />}
    {showLogin && (
      <Login
        setShowLogin={setShowLogin}
        setCurrentUsername={setCurrentUsername}
        myStorage={myStorage}
      />
    )}
  </div>

  );
}

export default App;
