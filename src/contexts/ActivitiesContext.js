import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      );
      if (response.data.code === "200") {
        setActivities(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch activities");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <ActivitiesContext.Provider value={{ activities, loading, error }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  return useContext(ActivitiesContext);
};
