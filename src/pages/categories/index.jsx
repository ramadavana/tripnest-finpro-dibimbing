/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function Categories() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
        );
        const activitiesRes = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
          { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
        );

        setCategories(categoriesRes.data.data);
        setActivities(activitiesRes.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (activityId) => {
    const token = getCookie("token"); // Ambil token dari cookies
    if (!token) {
      alert("You need to log in to add to cart.");
      return;
    }

    try {
      await axios.post(
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
    } catch (err) {
      alert("Failed to add activity to cart. Please try again.");
    }
  };

  if (loading) {
    return <p className="mt-10 text-center">Loading categories and activities...</p>;
  }

  if (error) {
    return <p className="mt-10 text-center text-red-500">{error}</p>;
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? activity.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-screen-xl min-h-screen p-6 mx-auto bg-[#f2f2f2]">
      <h1 className="mb-6 text-2xl font-bold text-center text-[#f96d00]">
        Activities by Categories
      </h1>
      <input
        type="text"
        placeholder="Search activities..."
        className="w-full p-2 mb-6 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === null ? "bg-[#f96d00] text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedCategory(null)}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded ${
              selectedCategory === category.id ? "bg-[#f96d00] text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(category.id)}>
            {category.name}
          </button>
        ))}
      </div>
      {filteredActivities.length === 0 ? (
        <p className="text-center text-gray-500">No activities found.</p>
      ) : selectedCategory ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredActivities.map((activity) => {
            const priceAfterDiscount = activity.price - activity.price_discount;

            return (
              <div
                key={activity.id}
                className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                <img
                  src={activity.imageUrls[0]}
                  alt={activity.title}
                  className="object-cover w-full h-40 rounded-t-lg"
                />
                <div className="mt-2">
                  <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {activity.description || "No description available"}
                  </p>

                  <div className="flex items-center mt-1 text-sm text-yellow-500">
                    <ion-icon name="star" />
                    <span>{activity.rating}</span>
                    <span className="ml-2 text-gray-500">({activity.total_reviews} reviews)</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-400 line-through">
                      Rp {activity.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-lg font-bold text-[#F96D00]">
                      Rp {priceAfterDiscount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link href={`/activities/${activity.id}`}>
                    <button className="w-full px-4 py-2 mt-2 text-white bg-[#f96d00] rounded-lg hover:bg-[#A03D00]">
                      View Details
                    </button>
                  </Link>
                  <button
                    className="w-full px-4 py-2 mt-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                    onClick={() => handleAddToCart(activity.id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">{category.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredActivities
                .filter((activity) => activity.categoryId === category.id)
                .map((activity) => {
                  const priceAfterDiscount = activity.price - activity.price_discount;

                  return (
                    <div
                      key={activity.id}
                      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                      <img
                        src={activity.imageUrls[0]}
                        alt={activity.title}
                        className="object-cover w-full h-40 rounded-t-lg"
                      />
                      <div className="mt-2">
                        <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {activity.description || "No description available"}
                        </p>

                        <div className="flex items-center mt-1 text-sm text-yellow-500">
                          <ion-icon name="star" />
                          <span>{activity.rating}</span>
                          <span className="ml-2 text-gray-500">
                            ({activity.total_reviews} reviews)
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-400 line-through">
                            Rp {activity.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-lg font-bold text-[#F96D00]">
                            Rp {priceAfterDiscount.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Link href={`/activities/${activity.id}`}>
                          <button className="w-full px-4 py-2 mt-2 text-white bg-[#f96d00] rounded-lg hover:bg-[#A03D00]">
                            View Details
                          </button>
                        </Link>
                        <button
                          className="w-full px-4 py-2 mt-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                          onClick={() => handleAddToCart(activity.id)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
