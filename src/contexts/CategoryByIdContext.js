// contexts/CategoryByIdContext.js

import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CategoryByIdContext = createContext();
const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

// Membuat instance axios dengan konfigurasi API Key
const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    apiKey: API_KEY,
  },
});

export const CategoryByIdProvider = ({ children }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data category berdasarkan ID
  const fetchCategoryById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get(`/api/v1/category/${id}`);
      setCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      setError("Failed to load category data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryByIdContext.Provider value={{ category, fetchCategoryById, loading, error }}>
      {children}
    </CategoryByIdContext.Provider>
  );
};

// Hook untuk menggunakan CategoryByIdContext
export function useCategoryById() {
  return useContext(CategoryByIdContext);
}
