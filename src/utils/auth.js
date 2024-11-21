// src/utils/auth.js
import { deleteCookie, getCookie } from "cookies-next";
import Router from "next/router";
import { ENDPOINTS, createApiHeaders } from "@/config/api";

export const logout = () => {
  // Delete auth related cookies
  deleteCookie("token");
  deleteCookie("user");

  // Redirect to home page
  Router.push("/");
};

export const isAuthenticated = () => {
  const token = getCookie("token");
  return !!token;
};

// Function to validate token status
export const validateToken = async () => {
  const token = getCookie("token");

  if (!token) {
    return { valid: false };
  }

  try {
    const response = await fetch(ENDPOINTS.USER, {
      headers: createApiHeaders(token),
    });

    if (!response.ok) {
      // Token invalid, perform logout
      logout();
      return { valid: false };
    }

    const userData = await response.json();
    return { valid: true, user: userData };
  } catch (error) {
    // Error occurred, perform logout
    logout();
    return { valid: false, error };
  }
};

// Function untuk login
export const login = async (email, password) => {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: createApiHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Function untuk register
export const register = async (userData) => {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: createApiHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
