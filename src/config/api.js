// src/config/api.js

export const API_BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
export const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export const ENDPOINTS = {
  USER: `${API_BASE_URL}/user`,
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  UPDATE_PROFILE: `${API_BASE_URL}/update-profile`,
  CREATE_ACTIVITY: `${API_BASE_URL}/create-activity`,
  UPDATE_ACTIVITY: `${API_BASE_URL}/update-activity`,
  DELETE_ACTIVITY: `${API_BASE_URL}/delete-activity`,
  ACTIVITIES: `${API_BASE_URL}/activities`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  BANNERS: `${API_BASE_URL}/banners`,
  CREATE_CART: `${API_BASE_URL}/create-cart`,
  UPDATE_CART: `${API_BASE_URL}/update-cart`,
  DELETE_CART: `${API_BASE_URL}/delete-cart`,
  MY_CART: `${API_BASE_URL}/cart`,
};

export const createApiHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
    apiKey: API_KEY,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
