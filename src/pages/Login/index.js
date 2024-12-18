import React, { useState } from 'react';
import apiClient from '../../config/apiClient'; // Use apiClient for API calls
import Cookies from 'js-cookie';  // Add this import

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  Typography
} from '@material-ui/core';

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await apiClient.post(
        '/token/',
        {
          username,
          password
        },
        {
          withCredentials: true // Include credentials in the request
        }
      );

      if (response.data.access) {
        
        localStorage.setItem('token', response.data.access);
        console.log('Login successful!');
        
        // Set the refresh token as a cookie
        Cookies.set('refresh_token', response.data.refresh, {
          expires: 1, // Cookie expires in 7 days
          path: '/', // Cookie is available for all paths
          // secure: false, // Secure in production
          sameSite: 'Lax' // Cross-site cookie policy
        });

        // Redirect to dashboard or another protected route
        window.location.href = '/ui/dashboard/';
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.response?.data?.detail || 'Invalid username or password.');
    }
  };

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-content--inner d-flex align-items-center">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content py-5">
                  <Grid item md={10} lg={8} xl={4} className="mx-auto">
                    <div className="text-center">
                      <h1 className="display-4 mb-1 font-weight-bold">Login</h1>
                      <p className="font-size-lg mb-0 text-black-50 py-4">
                        Fill in the fields below to login to your account
                      </p>
                    </div>
                    <form onSubmit={handleLogin}>
                      <div className="mb-4">
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="textfield-username"
                          label="Username address"
                          type=""
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MailOutlineTwoToneIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <TextField
                          fullWidth
                          variant="outlined"
                          id="textfield-password"
                          label="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockTwoToneIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                      {error && (
                        <Typography color="error" className="mb-3">
                          {error}
                        </Typography>
                      )}
                      <div className="text-center py-4">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className="btn-second font-weight-bold w-50 my-2"
                        >
                          Sign in
                        </Button>
                      </div>
                    </form>
                    <div className="text-center text-black-50 mt-3">
                      Don't have an account?{' '}
                      <a
                        href="#/"
                        onClick={(e) => e.preventDefault()}
                        className="text-first"
                      >
                        Sign up
                      </a>
                    </div>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login