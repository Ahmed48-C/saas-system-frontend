import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../config/apis';

const UnprotectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  // For testing
//   const TEST_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NDk0NTY5LCJpYXQiOjE3MzQzMjE3NjksImp0aSI6Ijk0MGUyYzkwOTBjYTRhMzhhMTVjMmI1ZjAwYzcxYmY2IiwidXNlcl9pZCI6M30.Vo_NO7jL400JKWX40EyZi6_eHA39KJqv5vowi2C-v2I';
  
  // For production
  const token = localStorage.getItem('token');
//   const token = TEST_TOKEN;

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
          // Try to refresh the token
          try {
            console.log('Refreshing token...');
            const refreshResponse = await fetch(`${BASE_URL}/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // equivalent to withCredentials: true
            });

            console.log('Refresh response:', refreshResponse);

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              // Save the new token
              localStorage.setItem('token', data.access);
              console.log('New token:', data.access);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              localStorage.removeItem('token');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
          }
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
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/ui/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default UnprotectedRoute;