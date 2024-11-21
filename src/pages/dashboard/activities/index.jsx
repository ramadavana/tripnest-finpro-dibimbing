/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";

const DashboardActivities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentActivity, setCurrentActivity] = useState({
    id: null,
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [],
    price: "",
    price_discount: "",
    rating: "",
    total_reviews: "",
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
    imageFiles: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const { uploadImage } = useUploadImage();
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        { headers: { apiKey } }
      );
      const sortedActivitesByDate = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setActivities(sortedActivitesByDate);
    } catch (error) {
      console.error("Failed to fetch activities:", error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        { headers: { apiKey } }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error.response?.data || error.message);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", currentActivity); // Debugging

    try {
      const token = getCookie("token");
      const apiUrl = isEditing
        ? `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${currentActivity.id}`
        : `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity`;

      // Upload images if any
      const imageUrls = await Promise.all(
        currentActivity.imageFiles.map((file) => uploadImage(file))
      );

      const response = await axios.post(
        apiUrl,
        {
          categoryId: currentActivity.categoryId,
          title: currentActivity.title,
          description: currentActivity.description,
          imageUrls: imageUrls, // Use uploaded image URLs
          price: parseFloat(currentActivity.price),
          price_discount: parseFloat(currentActivity.price_discount),
          rating: parseFloat(currentActivity.rating),
          total_reviews: parseInt(currentActivity.total_reviews),
          facilities: currentActivity.facilities,
          address: currentActivity.address,
          province: currentActivity.province,
          city: currentActivity.city,
          location_maps: currentActivity.location_maps,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      alert(isEditing ? "Activity updated successfully!" : "Activity created successfully!"); // Success alert
      fetchActivities(); // Refresh data
      resetForm(); // Reset form
    } catch (error) {
      console.error("Error:", error.response.data);
      alert("Failed to save activity");
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie("token");
    if (confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      try {
        await axios.delete(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`,
          {
            headers: { apiKey, Authorization: `Bearer ${token}` },
          }
        );
        alert("Activity deleted successfully!");
        fetchActivities();
      } catch (error) {
        console.error("Failed to delete activity:", error.response?.data || error.message);
        alert("Failed to delete activity.");
      }
    }
  };

  const resetForm = () => {
    setCurrentActivity({
      id: null,
      categoryId: "",
      title: "",
      description: "",
      imageUrls: [],
      price: "",
      price_discount: "",
      rating: "",
      total_reviews: "",
      facilities: "",
      address: "",
      province: "",
      city: "",
      location_maps: "",
      imageFiles: [],
    });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Manage Activities</h1>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Select Category */}
          <select
            value={currentActivity.categoryId}
            onChange={(e) => setCurrentActivity({ ...currentActivity, categoryId: e.target.value })}
            required
            className="px-3 py-2 border rounded">
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="Activity Title"
            value={currentActivity.title}
            onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={currentActivity.description}
            onChange={(e) =>
              setCurrentActivity({ ...currentActivity, description: e.target.value })
            }
            required
            className="col-span-3 px-3 py-2 border rounded"
          />

          {/* Images */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setCurrentActivity({
                ...currentActivity,
                imageFiles: Array.from(e.target.files),
              })
            }
            className="px-3 py-2 border rounded"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={currentActivity.price}
            onChange={(e) => setCurrentActivity({ ...currentActivity, price: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* Price Discount */}
          <input
            type="number"
            placeholder="Price Discount"
            value={currentActivity.price_discount}
            onChange={(e) =>
              setCurrentActivity({
                ...currentActivity,
                price_discount: e.target.value,
              })
            }
            required
            className="px-3 py-2 border rounded"
          />

          {/* Rating */}
          <input
            type="number"
            step="0.1"
            placeholder="Rating (1-10)"
            value={currentActivity.rating}
            onChange={(e) => setCurrentActivity({ ...currentActivity, rating: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* Total Reviews */}
          <input
            type="number"
            placeholder="Total Reviews"
            value={currentActivity.total_reviews}
            onChange={(e) =>
              setCurrentActivity({
                ...currentActivity,
                total_reviews: e.target.value,
              })
            }
            required
            className="px-3 py-2 border rounded"
          />

          {/* Facilities */}
          <textarea
            placeholder="Facilities (e.g., Gym, Pool, etc.)"
            value={currentActivity.facilities}
            onChange={(e) => setCurrentActivity({ ...currentActivity, facilities: e.target.value })}
            required
            className="col-span-3 px-3 py-2 border rounded"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={currentActivity.address}
            onChange={(e) => setCurrentActivity({ ...currentActivity, address: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* Province */}
          <input
            type="text"
            placeholder="Province"
            value={currentActivity.province}
            onChange={(e) => setCurrentActivity({ ...currentActivity, province: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* City */}
          <input
            type="text"
            placeholder="City"
            value={currentActivity.city}
            onChange={(e) => setCurrentActivity({ ...currentActivity, city: e.target.value })}
            required
            className="px-3 py-2 border rounded"
          />

          {/* Location Maps */}
          <textarea
            placeholder="Embed Google Maps iframe"
            value={currentActivity.location_maps}
            onChange={(e) =>
              setCurrentActivity({
                ...currentActivity,
                location_maps: e.target.value,
              })
            }
            required
            className="col-span-3 px-3 py-2 border rounded"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
            {isEditing ? "Update Activity" : "Create Activity"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-white bg-gray-500 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Images</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Price Discount</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Total Reviews</th>
              <th className="px-4 py-2 border">Facilities</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Province</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td className="px-4 py-2 text-center border">{index + 1}</td>
                <td className="px-4 py-2 border">{activity.title}</td>
                <td className="px-4 py-2 border">{activity.category.name}</td>
                <td className="px-4 py-2 border">
                  {activity.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Activity Image ${idx + 1}`}
                      className="object-cover w-16 h-16"
                    />
                  ))}
                </td>
                <td className="px-4 py-2 border">{activity.price}</td>
                <td className="px-4 py-2 border">{activity.price_discount}</td>
                <td className="px-4 py-2 border">{activity.rating}</td>
                <td className="px-4 py-2 border">{activity.total_reviews}</td>
                <td className="px-4 py-2 border">{activity.facilities}</td>
                <td className="px-4 py-2 border">{activity.address}</td>
                <td className="px-4 py-2 border">{activity.province}</td>
                <td className="px-4 py-2 border">{activity.city}</td>
                <td className="px-4 py-2 text-center border">
                  <button
                    onClick={() =>
                      setCurrentActivity({
                        ...activity,
                        imageFiles: [],
                      }) || setIsEditing(true)
                    }
                    className="px-2 py-1 mx-1 text-white bg-yellow-500 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="px-2 py-1 mx-1 text-white bg-red-500 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardActivities;
