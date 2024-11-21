import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

// Membuat Context
export const CategoriesContext = createContext();

// Membuat Provider
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        );
        setCategories(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};
