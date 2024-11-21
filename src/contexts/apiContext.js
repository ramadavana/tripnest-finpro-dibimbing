// src/context/ApiContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { ENDPOINTS, createApiHeaders } from "../config/api";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from cookies
  const getToken = () => {
    return getCookie("token");
  };

  // Set token to cookies
  const setToken = (token) => {
    setCookie("token", token);
  };

  // Remove token from cookies
  const removeToken = () => {
    deleteCookie("token");
  };

  // Basic API request handler
  const apiRequest = async (method, url, data = null, requireAuth = true) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      const headers = createApiHeaders(requireAuth ? token : null);

      const response = await axios({
        method,
        url,
        data,
        headers,
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Auth related functions
  const login = async (email, password) => {
    const response = await apiRequest("POST", ENDPOINTS.LOGIN, { email, password }, false);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  };

  const register = async (userData) => {
    return await apiRequest("POST", ENDPOINTS.REGISTER, userData, false);
  };

  const logout = () => {
    removeToken();
  };

  const updateProfile = async (profileData) => {
    return await apiRequest("PUT", ENDPOINTS.UPDATE_PROFILE, profileData);
  };

  // Activity related functions
  const getActivities = async () => {
    return await apiRequest("GET", ENDPOINTS.ACTIVITIES, null, false);
  };

  const createActivity = async (activityData) => {
    return await apiRequest("POST", ENDPOINTS.CREATE_ACTIVITY, activityData);
  };

  const updateActivity = async (activityId, activityData) => {
    return await apiRequest("PUT", `${ENDPOINTS.UPDATE_ACTIVITY}/${activityId}`, activityData);
  };

  const deleteActivity = async (activityId) => {
    return await apiRequest("DELETE", `${ENDPOINTS.DELETE_ACTIVITY}/${activityId}`);
  };

  // Category and Banner functions
  const getCategories = async () => {
    return await apiRequest("GET", ENDPOINTS.CATEGORIES, null, false);
  };

  const getBanners = async () => {
    return await apiRequest("GET", ENDPOINTS.BANNERS, null, false);
  };

  // Cart related functions
  const getMyCart = async () => {
    return await apiRequest("GET", ENDPOINTS.MY_CART);
  };

  const createCart = async (cartData) => {
    return await apiRequest("POST", ENDPOINTS.CREATE_CART, cartData);
  };

  const updateCart = async (cartId, cartData) => {
    return await apiRequest("PUT", `${ENDPOINTS.UPDATE_CART}/${cartId}`, cartData);
  };

  const deleteCart = async (cartId) => {
    return await apiRequest("DELETE", `${ENDPOINTS.DELETE_CART}/${cartId}`);
  };

  const contextValue = {
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getCategories,
    getBanners,
    getMyCart,
    createCart,
    updateCart,
    deleteCart,
    getToken,
  };

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

// Custom hook untuk menggunakan API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
