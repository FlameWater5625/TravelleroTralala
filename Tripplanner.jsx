// src/pages/TripPlanner.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TripPlanner = ({ user }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(1000);
  const [preferences, setPreferences] = useState({
    adventure: false,
    culture: false,
    relaxation: false,
    food: false
  });
  const [weatherData, setWeatherData] = useState(null);
  const [flightOptions, setFlightOptions] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchFlightOptions = async () => {
    try {
      // This would be replaced with actual Skyscanner API call
      const response = await axios.get('/api/flights', {
        params: {
          origin: user.profile?.homeCity || 'Paris',
          destination,
          departureDate: startDate?.toISOString().split('T')[0],
          returnDate: endDate?.toISOString().split('T')[0],
          budget
        }
      });
      setFlightOptions(response.data);
    } catch (error) {
      console.error('Error fetching flight options:', error);
    }
  };

  const fetchHotelOptions = async () => {
    try {
      // This would be replaced with actual Booking.com API call
      const response = await axios.get('/api/hotels', {
        params: {
          destination,
          checkIn: startDate?.toISOString().split('T')[0],
          checkOut: endDate?.toISOString().split('T')[0],
          budget: budget * 0.4 // Allocate 40% of budget to accommodation
        }
      });
      setHotelOptions(response.data);
    } catch (error) {
      console.error('Error fetching hotel options:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // This would integrate with ChatGPT API
      const response = await axios.post('/api/recommendations', {
        destination,
        dates: {
          start: startDate,
          end: endDate
        },
        budget,
        preferences,
        weather: weatherData?.list[0]?.weather[0]?.main
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;
    
    setLoading(true);
    await fetchWeatherData(destination);
    await fetchFlightOptions();
    await fetchHotelOptions();
    await fetchRecommendations();
    setLoading(false);
  };

  return (
    <div className="trip-planner">
      <h1>Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Travel Dates</label>
          <div className="date-range">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start date"
              minDate={new Date()}
              required
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="End date"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Budget (€)</label>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
          />
          <span>{budget}€</span>
        </div>
        
        <div className="form-group">
          <label>Preferences</label>
          <div className="preferences">
            {Object.entries(preferences).map(([key, value]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handlePreferenceChange}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Planning...' : 'Plan My Trip'}
        </button>
      </form>
      
      {/* Results sections would be added here */}
    </div>
  );
};

export default TripPlanner;
