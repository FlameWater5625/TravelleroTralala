import React, { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import ActivityCard from './ActivityCard';
import HotelCard from './HotelCard';
import FlightCard from './FlightCard';

const RecommendationsPage = ({ tripData }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [activities, setActivities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Simuler l'appel aux différentes APIs
    const fetchData = async () => {
      try {
        // Récupération météo
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${tripData.destination}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=fr`
        );
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        // Récupération activités (via ChatGPT)
        const activitiesResponse = await fetch('/api/chatgpt/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: tripData.destination,
            preferences: tripData.preferences,
            duration: Math.ceil((tripData.endDate - tripData.startDate) / (1000 * 60 * 60 * 24))
          })
        });
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

        // Récupération hôtels (via Booking API)
        const hotelsResponse = await fetch('/api/booking/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: tripData.destination,
            checkIn: tripData.startDate.toISOString().split('T')[0],
            checkOut: tripData.endDate.toISOString().split('T')[0],
            budget: tripData.budget
          })
        });
        const hotelsData = await hotelsResponse.json();
        setHotels(hotelsData);

        // Récupération vols (via Skyscanner API)
        const flightsResponse = await fetch('/api/skyscanner/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: 'PARI', // À remplacer par la localisation de l'utilisateur
            destination: tripData.destination,
            departureDate: tripData.startDate.toISOString().split('T')[0],
            returnDate: tripData.endDate.toISOString().split('T')[0],
            budget: tripData.budget
          })
        });
        const flightsData = await flightsResponse.json();
        setFlights(flightsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tripData]);

  if (loading) {
    return <div className="loading-container">Chargement des recommandations...</div>;
  }

  return (
    <div className="recommendations-container">
      <h1>Recommandations pour {tripData.destination}</h1>
      
      <section className="weather-section">
        <h2>Météo prévue</h2>
        {weather && <WeatherCard weatherData={weather} />}
      </section>

      <section className="flights-section">
        <h2>Options de vol</h2>
        <div className="cards-grid">
          {flights.map((flight, index) => (
            <FlightCard key={index} flight={flight} />
          ))}
        </div>
      </section>

      <section className="hotels-section">
        <h2>Hébergements recommandés</h2>
        <div className="cards-grid">
          {hotels.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} budget={tripData.budget} />
          ))}
        </div>
      </section>

      <section className="activities-section">
        <h2>Activités selon vos préférences</h2>
        <div className="cards-grid">
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </div>
      </section>

      <button className="save-button">Sauvegarder cet itinéraire</button>
    </div>
  );
};

export default RecommendationsPage;
