/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";
import { useRouter } from "next/router";

export default function DashboardBanner() {
  const [banners, setBanners] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const { uploadImage } = useUploadImage();

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      const sortedBanners = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBanners(sortedBanners);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to fetch banners.");
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    const { name, imageFile, imageUrl } = currentBanner;

    try {
      // Upload gambar jika file tersedia
      const uploadedImageUrl = imageFile ? await uploadImage(imageFile) : imageUrl;

      if (isEditing) {
        // Update Banner
        await axios.post(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${currentBanner.id}`,
          { name, imageUrl: uploadedImageUrl },
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Banner updated successfully!");
      } else {
        // Create Banner
        await axios.post(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner",
          { name, imageUrl: uploadedImageUrl },
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Banner created successfully!");
      }

      fetchBanners(); // Refresh data setelah perubahan
      setCurrentBanner(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating/updating banner:", error.response?.data || error.message);
      alert("Failed to save banner.");
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie("token");
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete banner.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCurrentBanner({
      ...currentBanner,
      [name]: files ? files[0] : value,
    });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Manage Banners</h1>
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Banner Name"
          value={currentBanner?.name || ""}
          onChange={handleInputChange}
          className="px-2 py-1 mr-2 border rounded"
          required
        />
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleInputChange}
          className="px-2 py-1 mr-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
          {isEditing ? "Update Banner" : "Create Banner"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setCurrentBanner(null);
            }}
            className="px-4 py-2 ml-2 text-white bg-gray-500 rounded">
            Cancel
          </button>
        )}
      </form>

      <table className="text-sm border border-collapse border-gray-200 table-auto w-fit">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td className="px-4 py-2 text-center border">{banner.name}</td>
              <td className="px-4 py-2 border">
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="object-cover w-32 h-32 lg:w-64 lg:h-64"
                />
              </td>
              <td className="px-4 py-2 text-center border">
                <button
                  onClick={() => {
                    setCurrentBanner(banner);
                    setIsEditing(true);
                  }}
                  className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
