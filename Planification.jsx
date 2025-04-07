import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TripPlanner = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(1000);
  const [preferences, setPreferences] = useState({
    adventure: false,
    culture: false,
    relaxation: false,
    food: false,
  });

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tripData = {
      destination,
      startDate,
      endDate,
      budget,
      preferences: Object.keys(preferences).filter(key => preferences[key])
    };
    onSubmit(tripData);
  };

  return (
    <div className="planner-container">
      <h1>Planifiez votre voyage idéal</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Où souhaitez-vous aller ?"
            required
          />
        </div>

        <div className="date-range">
          <div className="form-group">
            <label>Date de départ</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Date de départ"
              required
            />
          </div>
          <div className="form-group">
            <label>Date de retour</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Date de retour"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Budget (€)</label>
          <input
            type="range"
            min="200"
            max="10000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <span className="budget-value">{budget}€</span>
        </div>

        <div className="preferences-group">
          <label>Préférences :</label>
          <div className="preferences-options">
            {Object.keys(preferences).map((key) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  name={key}
                  checked={preferences[key]}
                  onChange={handlePreferenceChange}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="primary-button">
          Trouver des recommandations
        </button>
      </form>
    </div>
  );
};

export default TripPlanner;
