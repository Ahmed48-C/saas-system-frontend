// apiClient.js
import axios from 'axios';
import { BASE_URL } from './apis';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL, // Replace with your actual API base URL
});

const TEST_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NDk0NTY5LCJpYXQiOjE3MzQzMjE3NjksImp0aSI6Ijk0MGUyYzkwOTBjYTRhMzhhMTVjMmI1ZjAwYzcxYmY2IiwidXNlcl9pZCI6M30.Vo_NO7jL400JKWX40EyZi6_eHA39KJqv5vowi2C-v2I';

// Add a request interceptor to include the token dynamically
apiClient.interceptors.request.use(
    (config) => {
        // For production
        const token = localStorage.getItem('token');
        
        // For testing
        // const token = TEST_TOKEN;
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
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Redirect to login page
                window.location.href = '/ui/login';
            } else if (error.response.status === 500) {
                // Redirect to 500 error page
                window.location.href = '/ui/500';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;