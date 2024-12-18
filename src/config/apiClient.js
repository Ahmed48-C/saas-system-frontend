// apiClient.js
import axios from 'axios';
import { BASE_URL } from './apis';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL, // Replace with your actual API base URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // This ensures cookies are sent with requests
});

// Add a request interceptor to include the access token
apiClient.interceptors.request.use(
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

// Add a response interceptor to handle 401 and 500 errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                try {
                    console.log('Refreshing token...');
                    // Try to refresh the token
                    const response = await axios.post(
                        `${BASE_URL}/token/refresh/`,
                        {},  // empty body
                        {
                            withCredentials: true,  // Important!
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    );

                    console.log('Refresh response:', response);
                    
                    if (response.data.access) {
                        // Save the new token
                        localStorage.setItem('token', response.data.access);
                        console.log('New token:', response.data.access);
                        
                        // Retry the original request with the new token
                        const config = error.config;
                        config.headers.Authorization = `Bearer ${response.data.access}`;
                        return apiClient(config);
                    }
                } catch (refreshError) {
                    // If refresh fails, redirect to login
                    window.location.href = '/ui/login';
                }
            } else if (error.response.status === 500) {
                // Redirect to 500 error page
                window.location.href = '/ui/500';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;