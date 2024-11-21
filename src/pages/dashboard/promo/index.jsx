/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";

const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const PromoPage = () => {
  const { uploadImage } = useUploadImage();
  const [promos, setPromos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [editingPromo, setEditingPromo] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = getCookie("token");

  const fetchPromos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/promos`, {
        headers: {
          apiKey: API_KEY,
        },
      });
      const sortedPromoByDate = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPromos(sortedPromoByDate);
    } catch (error) {
      console.error("Failed to fetch promos:", error.response?.data || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      // Konversi nilai ke number
      const payload = {
        ...formData,
        promo_discount_price: Number(formData.promo_discount_price),
        minimum_claim_price: Number(formData.minimum_claim_price),
      };

      const url = editingPromo
        ? `${BASE_URL}/api/v1/update-promo/${editingPromo.id}`
        : `${BASE_URL}/api/v1/create-promo`;
      const method = "post";

      await axios[method](url, payload, {
        headers: {
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      alert(editingPromo ? "Successfully Update Promo" : "Successfully Create Promo");
      fetchPromos();
      setEditingPromo(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        terms_condition: "",
        promo_code: "",
        promo_discount_price: "",
        minimum_claim_price: "",
      });
    } catch (error) {
      alert(editingPromo ? "Failed to Update Promo" : "Failed to Create Promo");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure want to delete this promo?")) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/delete-promo/${id}`, {
          headers: {
            apiKey: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Successfully Delete Promo");
        fetchPromos();
      } catch (error) {
        alert("Failed to Delete Promo");
      }
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({ ...promo });
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const resetForm = () => {
    setEditingPromo(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
  };

  const handleResetForm = () => {
    resetForm();
  };

  return (
    <div className="p-4 ml-16">
      <h1 className="mb-4 text-2xl font-bold">Manage Promos</h1>
      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="mb-2"
          disabled={loading}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <textarea
          name="terms_condition"
          placeholder="Terms and Conditions"
          value={formData.terms_condition}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="text"
          name="promo_code"
          placeholder="Promo Code"
          value={formData.promo_code}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="number"
          name="promo_discount_price"
          placeholder="Discount Price"
          value={formData.promo_discount_price}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="number"
          name="minimum_claim_price"
          placeholder="Minimum Claim Price"
          value={formData.minimum_claim_price}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border"
        />
        <button
          onClick={handleCreateOrUpdate}
          className="p-2 text-white bg-blue-500"
          disabled={loading}>
          {editingPromo ? "Update Promo" : "Create Promo"}
        </button>
        {editingPromo && (
          <button
            onClick={handleResetForm}
            className="p-2 ml-2 text-white bg-red-500"
            disabled={loading}>
            Cancel
          </button>
        )}
      </div>
      <table className="w-full border border-collapse table-auto">
        <thead>
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Promo Code</th>
            <th className="p-2 border">Discount Price</th>
            <th className="p-2 border">Minimum Claim Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr key={promo.id}>
              <td className="p-2 border">
                <img src={promo.imageUrl} alt={promo.title} className="object-cover w-20 h-20" />
              </td>
              <td className="p-2 border">{promo.title}</td>
              <td className="p-2 border">{promo.description}</td>
              <td className="p-2 border">{promo.promo_code}</td>
              <td className="p-2 border">{promo.promo_discount_price}</td>
              <td className="p-2 border">{promo.minimum_claim_price}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(promo)}
                  className="p-1 mr-2 text-white bg-yellow-500">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="p-1 text-white bg-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromoPage;
