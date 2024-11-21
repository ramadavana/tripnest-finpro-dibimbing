/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    imageUrl: "",
    imageFile: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { uploadImage } = useUploadImage();

  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        {
          headers: { apiKey },
        }
      );
      const sortedCategories = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error.response?.data || error.message);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    const { name, imageFile, id } = currentCategory;

    try {
      let imageUrl = currentCategory.imageUrl; // Use existing imageUrl
      if (imageFile) {
        imageUrl = await uploadImage(imageFile); // Upload new image
      }

      if (isEditing) {
        // Update category
        await axios.post(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-category/${id}`,
          { name, imageUrl },
          {
            headers: { apiKey, Authorization: `Bearer ${token}` },
          }
        );
        alert("Category updated successfully!");
      } else {
        // Create new category
        await axios.post(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-category",
          { name, imageUrl },
          {
            headers: { apiKey, Authorization: `Bearer ${token}` },
          }
        );
        alert("Category created successfully!");
      }

      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error.response?.data || error.message);
      alert("Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    const token = getCookie("token");
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await axios.delete(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-category/${id}`,
          {
            headers: { apiKey, Authorization: `Bearer ${token}` },
          }
        );
        alert("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error.response?.data || error.message);
        alert("Failed to delete category.");
      }
    }
  };

  const resetForm = () => {
    setCurrentCategory({ id: null, name: "", imageUrl: "", imageFile: null });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 ml-16 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Manage Categories</h1>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={currentCategory.name}
          onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
          required
          className="px-2 py-1 mr-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCurrentCategory({
              ...currentCategory,
              imageFile: e.target.files[0],
            })
          }
          className="px-2 py-1 mr-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          {isEditing ? "Update Category" : "Create Category"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 ml-4 text-white bg-gray-500 rounded hover:bg-gray-600">
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="border border-gray-300 w-fit">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td className="px-4 py-2 text-center border">{index + 1}</td>
                <td className="px-4 py-2 border">{category.name}</td>
                <td className="px-4 py-2 text-center border">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-32 h-32 lg:w-64 lg:h-64"
                  />
                </td>
                <td className="px-4 py-2 text-center border">
                  <button
                    onClick={() =>
                      setCurrentCategory({
                        id: category.id,
                        name: category.name,
                        imageUrl: category.imageUrl,
                        imageFile: null,
                      }) || setIsEditing(true)
                    }
                    className="px-2 py-1 mx-1 text-white bg-yellow-500 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
