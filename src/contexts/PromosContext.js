// contexts/PromoContext.js

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Membuat Context
export const PromoContext = createContext();

// API endpoint dan API key
const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

// Membuat Provider
export const PromoProvider = ({ children }) => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { apiKey: API_KEY },
        });
        setPromos(response.data.data);
      } catch (err) {
        setError("Failed to load promos.");
        console.error("Error fetching promos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  return (
    <PromoContext.Provider value={{ promos, loading, error }}>{children}</PromoContext.Provider>
  );
};
