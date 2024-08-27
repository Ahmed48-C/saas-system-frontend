// src/config/config.js
const BASE_URL = 'http://127.0.0.1:8000';

const API_ENDPOINTS = {

  DELETE_LOCATION: (id) => `${BASE_URL}/api/delete/location/${id}/`,
  DELETE_LOCATIONS: () => `${BASE_URL}/api/delete/locations/`,
  POST_LOCATION: () => `${BASE_URL}/api/post/location/`,
  PUT_LOCATION: (id) => `${BASE_URL}/api/put/location/${id}/`,
  GET_LOCATIONS: (from, to) => `${BASE_URL}/api/get/locations/?from=${from}&to=${to}`,
  GET_LOCATION: (id) => `${BASE_URL}/api/get/location/${id}/`,

  DELETE_SUPPLIER: (id) => `${BASE_URL}/api/delete/supplier/${id}/`,
  DELETE_SUPPLIERS: () => `${BASE_URL}/api/delete/suppliers/`,
  POST_SUPPLIER: () => `${BASE_URL}/api/post/supplier/`,
  PUT_SUPPLIER: (id) => `${BASE_URL}/api/put/supplier/${id}/`,
  GET_SUPPLIERS: (from, to) => `${BASE_URL}/api/get/suppliers/?from=${from}&to=${to}`,
  GET_SUPPLIER: (id) => `${BASE_URL}/api/get/supplier/${id}/`,

  DELETE_PRODUCT: (id) => `${BASE_URL}/api/delete/product/${id}/`,
  DELETE_PRODUCTS: () => `${BASE_URL}/api/delete/products/`,
  POST_PRODUCT: () => `${BASE_URL}/api/post/product/`,
  PUT_PRODUCT: (id) => `${BASE_URL}/api/put/product/${id}/`,
  GET_PRODUCTS: (from, to) => `${BASE_URL}/api/get/products/?from=${from}&to=${to}`,
  GET_PRODUCT: (id) => `${BASE_URL}/api/get/product/${id}/`,

  DELETE_STORE: (id) => `${BASE_URL}/api/delete/store/${id}/`,
  DELETE_STORES: () => `${BASE_URL}/api/delete/stores/`,
  POST_STORE: () => `${BASE_URL}/api/post/store/`,
  PUT_STORE: (id) => `${BASE_URL}/api/put/store/${id}/`,
  GET_STORES: (from, to) => `${BASE_URL}/api/get/stores/?from=${from}&to=${to}`,
  GET_STORE: (id) => `${BASE_URL}/api/get/store/${id}/`,

  DELETE_INVENTORY: (id) => `${BASE_URL}/api/delete/inventory/${id}/`,
  DELETE_INVENTORIES: () => `${BASE_URL}/api/delete/inventories/`,
  POST_INVENTORY: () => `${BASE_URL}/api/post/inventory/`,
  PUT_INVENTORY: (id) => `${BASE_URL}/api/put/inventory/${id}/`,
  GET_INVENTORIES: (from, to) => `${BASE_URL}/api/get/inventories/?from=${from}&to=${to}`,
  GET_INVENTORY: (id) => `${BASE_URL}/api/get/inventory/${id}/`,

  DELETE_REMINDER: (id) => `${BASE_URL}/api/delete/reminder/${id}/`,
  POST_REMINDER: () => `${BASE_URL}/api/post/reminder/`,
  GET_REMINDERS: () => `${BASE_URL}/api/get/reminders/`,
  GET_REMINDER: (id) => `${BASE_URL}/api/get/reminder/${id}/`,
  PUT_REMINDER: (id) => `${BASE_URL}/api/put/reminder/${id}/`,

  DELETE_CUSTOMER: (id) => `${BASE_URL}/api/delete/customer/${id}/`,
  DELETE_CUSTOMERS: () => `${BASE_URL}/api/delete/customers/`,
  POST_CUSTOMER: () => `${BASE_URL}/api/post/customer/`,
  PUT_CUSTOMER: (id) => `${BASE_URL}/api/put/customer/${id}/`,
  GET_CUSTOMERS: (from, to) => `${BASE_URL}/api/get/customers/?from=${from}&to=${to}`,
  GET_CUSTOMER: (id) => `${BASE_URL}/api/get/customer/${id}/`,

};

export default API_ENDPOINTS;
