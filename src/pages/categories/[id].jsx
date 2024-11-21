/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// pages/categories/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCategoryById } from "@/contexts/CategoryByIdContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";

export default function CategoryDetailPage() {
  const { category, fetchCategoryById, loading, error: categoryError } = useCategoryById();
  const [activities, setActivities] = useState([]);
  const [notification, setNotification] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (id) {
      fetchCategoryById(id);
      fetchActivitiesByCategoryId(id);
    }
  }, [id]);

  const fetchActivitiesByCategoryId = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities-by-category/${categoryId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setActivities(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (activityId) => {
    const token = getCookie("token"); // Ambil token dari cookies

    if (!token) {
      setNotification({ message: "You need to log in to add items to the cart.", type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Activity added to cart successfully!");
      router.reload();
      // Auto-dismiss notification after 3 seconds
    } catch (error) {
      console.error(error);
      setNotification({
        message: error.response?.data?.message || "Failed to add item to cart.",
        type: "error",
      });
      // Auto-dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  if (loading) return <Loading />;
  if (categoryError) return <p>{categoryError}</p>;
  if (!category) return <p>No category found.</p>;

  return (
    <section>
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="object-cover w-full h-full filter brightness-75"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
          {category.name}
        </h1>
      </div>

      <div className="p-4">
        {notification && (
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg text-white shadow-lg 
    animate-[fadeInOut_3s_ease-in-out] 
    ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        <h2 className="mt-4 text-2xl font-bold text-[#f96d00]">Activities</h2>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 bg-white rounded-lg shadow-md">
              <img
                src={activity.imageUrls[0]} // Display the first image
                alt={activity.title}
                className="object-cover w-full h-40 rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
              <p className="mt-2 line-through">
                <strong>Price:</strong> Rp{formatCurrency(activity.price)}
              </p>
              <p className="mt-2 text-[#f96d00] font-semibold">
                <strong>Price:</strong> Rp{formatCurrency(activity.price - activity.price_discount)}
              </p>
              <p className="mt-1">
                <strong>Rating:</strong> {activity.rating} ({activity.total_reviews} reviews)
              </p>
              <p className="mt-1">
                <strong>Location:</strong> {activity.city}, {activity.province}
              </p>
              {/* Add to Cart Button */}
              <div className="w-full flex-center">
                <button onClick={() => handleAddToCart(activity.id)} className="mt-4 btn-1">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
