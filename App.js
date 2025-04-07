// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Components
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return document.createElement('div', { 
      className: 'loading',
      textContent: 'Loading...'
    });
  }

  const appDiv = document.createElement('div');
  appDiv.className = 'app';

  const renderApp = () => {
    return createElement(Router, {}, 
      createElement('div', { className: 'app' },
        createElement(Header, { user: user, onLogout: handleLogout }),
        createElement(ToastContainer, { position: 'top-right', autoClose: 5000 }),
        createElement(Routes, {},
          createElement(Route, { path: '/', element: createElement(Home) }),
          createElement(Route, { 
            path: '/login', 
            element: user ? createElement(Navigate, { to: '/dashboard' }) : createElement(Login, { onLogin: handleLogin }) 
          }),
          createElement(Route, { 
            path: '/dashboard', 
            element: user ? createElement(Dashboard, { user }) : createElement(Navigate, { to: '/login' }) 
          }),
          createElement(Route, { 
            path: '/plan-trip', 
            element: user ? createElement(TripPlanner, { user }) : createElement(Navigate, { to: '/login' }) 
          }),
          createElement(Route, { 
            path: '/profile', 
            element: user ? createElement(Profile, { user }) : createElement(Navigate, { to: '/login' }) 
          })
        )
      )
    );
  };

  return renderApp();
}

// Helper function to create elements
function createElement(component, props = {}, ...children) {
  if (typeof component === 'string') {
    const element = document.createElement(component);
    
    for (const key in props) {
      if (key === 'className') {
        element.className = props[key];
      } else if (key === 'textContent') {
        element.textContent = props[key];
      } else {
        element.setAttribute(key, props[key]);
      }
    }
    
    children.forEach(child => {
      if (child) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      }
    });
    
    return element;
  } else {
    // For React components and React Router components
    return component({ ...props, children: children.length ? children : undefined });
  }
}

export default App;
