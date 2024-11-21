import axios from "axios";
import { getCookie } from "cookies-next";
import { createContext, useContext } from "react";

const UploadImageContext = createContext();

export const UploadImageProvider = ({ children }) => {
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      return response.data.url; // URL gambar
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
      throw new Error("Failed to upload image.");
    }
  };

  return (
    <UploadImageContext.Provider value={{ uploadImage }}>{children}</UploadImageContext.Provider>
  );
};

export const useUploadImage = () => useContext(UploadImageContext);
