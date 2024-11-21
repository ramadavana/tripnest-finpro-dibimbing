import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const BannersContext = createContext();

export const BannersProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      );
      setBanners(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch banners.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <BannersContext.Provider value={{ banners, loading, error }}>
      {children}
    </BannersContext.Provider>
  );
};
