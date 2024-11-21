/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";

export default function ActivityById() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        setActivity(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch activity data.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAddToCart = async () => {
    const token = getCookie("token");

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId: id },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Activity added to cart successfully!");
      router.reload();
    } catch (err) {
      setNotification(err.response?.data?.message || "Failed to add activity to cart.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Notification */}
      {notification && (
        <div className="fixed px-6 py-4 text-center text-white transform -translate-x-1/2 -translate-y-1/2 bg-black rounded shadow-lg top-1/2 left-1/2 animate-bounce">
          {notification}
        </div>
      )}

      <div className="max-w-5xl mx-auto overflow-hidden bg-white rounded shadow-md">
        {/* Title */}
        <h1 className="py-4 text-3xl font-bold text-center border-b">{activity.title}</h1>

        {/* Image */}
        <div className="p-4">
          <img
            src={activity.imageUrls[0]}
            alt={activity.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-lg text-gray-700">{activity.description}</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <p className="text-gray-800">
            <strong>Rating:</strong> {activity.rating} / 10
          </p>
          <p className="text-gray-800">
            <strong>Total Reviews:</strong> {activity.total_reviews}
          </p>
          <p className="text-gray-800">
            <strong>Province:</strong> {activity.province}
          </p>
          <p className="text-gray-800">
            <strong>Address:</strong> {activity.address}
          </p>
          <p className="text-gray-800">
            <strong>Facilities:</strong> {activity.facilities}
          </p>
          <p className="text-gray-800 line-through">
            <strong>Price:</strong> Rp{formatCurrency(activity.price)}
          </p>
          <p className="text-gray-800">
            <strong>Discounted Price:</strong> Rp
            {formatCurrency(activity.price - activity.price_discount)}
          </p>
        </div>

        {/* Map */}
        <div className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Location</h2>
          <div
            className="overflow-hidden rounded-lg shadow-md"
            dangerouslySetInnerHTML={{ __html: activity.location_maps }}
          />
        </div>

        {/* Add to Cart Button */}
        <div className="flex justify-center p-6">
          <button onClick={handleAddToCart} className="btn-1">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
