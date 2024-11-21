import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const PromoByIdContext = createContext();
const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

// Membuat Provider untuk PromoByIdContext
export const PromoByIdProvider = ({ children }) => {
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data promo berdasarkan ID
  const fetchPromoById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/api/v1/promo/${id}`, {
        headers: { apiKey: API_KEY },
      });
      setPromo(response.data.data);
    } catch (err) {
      console.error("Error fetching promo by ID:", err);
      setError("Failed to load promo data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PromoByIdContext.Provider value={{ promo, fetchPromoById, loading, error }}>
      {children}
    </PromoByIdContext.Provider>
  );
};

// Hook untuk menggunakan PromoByIdContext
export const usePromoById = () => {
  return useContext(PromoByIdContext);
};
