/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";

const CreateActivity = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageFiles: [],
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
  });
  const { uploadImage } = useUploadImage();
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, imageFiles: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    try {
      // Upload images if any
      const imageUrls = await Promise.all(formData.imageFiles.map((file) => uploadImage(file)));

      // Send POST request to create activity
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity",
        {
          ...formData,
          imageUrls,
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

      alert("Activity created successfully!");
      setFormData({
        categoryId: "",
        title: "",
        description: "",
        imageFiles: [],
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
      });
    } catch (error) {
      console.error("Error creating activity:", error.response?.data || error.message);
      alert("Failed to create activity.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Create Activity</h1>
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

        {/* Images */}
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
          placeholder="Rating (1-10)"
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
          placeholder="Facilities (e.g., WiFi, Parking)"
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
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Create Activity
        </button>
      </form>
    </div>
  );
};

export default CreateActivity;
