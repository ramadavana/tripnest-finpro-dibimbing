// contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

const CartContext = createContext();
const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCartData = async () => {
    const token = getCookie("token"); // Ambil token dari cookies
    if (!token) {
      setError("You need to log in to view your cart.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/v1/carts`, {
        headers: {
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.data || []);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError("Failed to fetch cart data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, fetchCartData, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
