import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext"; // Mengimpor UploadImageContext

const UpdateActivity = () => {
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [], // Daftar URL gambar
    price: "",
    price_discount: "",
    rating: "",
    total_reviews: "",
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
    imageFiles: [], // Menyimpan file gambar baru
  });
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id: activityId } = router.query;
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const { uploadImage } = useUploadImage(); // Menggunakan useUploadImage untuk upload gambar

  const fetchActivityDetails = async () => {
    if (!activityId) return;

    const token = getCookie("token");
    try {
      const response = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${activityId}`,
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const activity = response.data.data;
      setFormData({
        categoryId: activity.categoryId,
        title: activity.title,
        description: activity.description,
        imageUrls: activity.imageUrls,
        price: activity.price,
        price_discount: activity.price_discount,
        rating: activity.rating,
        total_reviews: activity.total_reviews,
        facilities: activity.facilities,
        address: activity.address,
        province: activity.province,
        city: activity.city,
        location_maps: activity.location_maps,
        imageFiles: [],
      });
    } catch (error) {
      console.error("Error fetching activity details:", error.response?.data || error.message);
      alert("Failed to fetch activity details. Please try again.");
    } finally {
      setIsFetching(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    setLoading(true);

    try {
      // Upload gambar baru
      const newImageUrls = await Promise.all(
        formData.imageFiles.map((file) => uploadImage(file)) // Menggunakan uploadImage untuk meng-upload gambar baru
      );

      // Mengganti gambar lama dengan gambar baru
      const updatedImageUrls = [...newImageUrls]; // Hanya gambar yang baru akan ada di sini

      const response = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${activityId}`,
        {
          ...formData,
          imageUrls: updatedImageUrls, // Menggunakan URL gambar baru
          price: parseFloat(formData.price),
          price_discount: parseFloat(formData.price_discount),
          rating: parseFloat(formData.rating),
          total_reviews: parseInt(formData.total_reviews),
        },
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Activity updated successfully!");
      router.push("/dashboard/activities");
    } catch (error) {
      console.error("Error updating activity:", error.response?.data || error.message);
      alert("Failed to update activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchActivityDetails();
  }, [activityId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Mengonversi FileList ke Array
    setFormData((prevData) => ({
      ...prevData,
      imageFiles: files, // Menyimpan file ke dalam state
    }));
  };

  if (isFetching) return <p>Loading activity details...</p>;

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Update Activity</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded">
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
          name="title"
          placeholder="Activity Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Current Images */}
        <div>
          <p className="font-semibold">Current Images:</p>
          <div className="flex gap-2">
            {formData.imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index}`} className="w-20 h-20 rounded" />
            ))}
          </div>
        </div>

        {/* New Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Price Discount */}
        <input
          type="number"
          name="price_discount"
          placeholder="Price Discount"
          value={formData.price_discount}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Rating */}
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={formData.rating}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Total Reviews */}
        <input
          type="number"
          name="total_reviews"
          placeholder="Total Reviews"
          value={formData.total_reviews}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Facilities */}
        <textarea
          name="facilities"
          placeholder="Facilities"
          value={formData.facilities}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Province */}
        <input
          type="text"
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* City */}
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Location Maps */}
        <textarea
          name="location_maps"
          placeholder="Embed Google Maps iframe"
          value={formData.location_maps}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
          disabled={loading}>
          {loading ? "Saving..." : "Update Activity"}
        </button>
      </form>
    </div>
  );
};

export default UpdateActivity;
