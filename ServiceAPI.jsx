// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getFlights = async (params) => {
  try {
    const response = await api.get('/flights', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

export const getHotels = async (params) => {
  try {
    const response = await api.get('/hotels', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

export const getWeather = async (city) => {
  try {
    const response = await api.get(`/weather/${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getRecommendations = async (data) => {
  try {
    const response = await api.post('/recommendations', data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const saveItinerary = async (itinerary) => {
  try {
    const response = await api.post('/itineraries', itinerary);
    return response.data;
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw error;
  }
};

export const getUserItineraries = async () => {
  try {
    const response = await api.get('/itineraries');
    return response.data;
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error;
  }
};
