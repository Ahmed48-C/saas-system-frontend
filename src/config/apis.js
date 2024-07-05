// src/config/config.js
const BASE_URL = 'http://127.0.0.1:8000';

const API_ENDPOINTS = {
  DELETE_LOCATION: (id) => `${BASE_URL}/api/delete/location/${id}/`,
  POST_LOCATION: () => `${BASE_URL}/api/post/location/`,
  PUT_LOCATION: (id) => `${BASE_URL}/api/put/location/${id}/`,
  GET_LOCATIONS: (from, to) => `${BASE_URL}/api/get/locations/?from=${from}&to=${to}`,
  GET_LOCATION: (id) => `${BASE_URL}/api/get/location/${id}/`,
};

export default API_ENDPOINTS;
