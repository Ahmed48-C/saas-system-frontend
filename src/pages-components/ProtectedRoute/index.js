// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../config/apis';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // For testing
  // const TEST_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NDk0NTY5LCJpYXQiOjE3MzQzMjE3NjksImp0aSI6Ijk0MGUyYzkwOTBjYTRhMzhhMTVjMmI1ZjAwYzcxYmY2IiwidXNlcl9pZCI6M30.Vo_NO7jL400JKWX40EyZi6_eHA39KJqv5vowi2C-v2I';
  
  // For production
  const token = localStorage.getItem('token');
  // const token = TEST_TOKEN;

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/token/verify/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // For production
          // localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
        // For production
        // localStorage.removeItem('token');
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/ui/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;