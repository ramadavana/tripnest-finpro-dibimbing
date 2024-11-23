/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useContext, useState, useEffect } from "react";
import { BannersContext } from "@/contexts/BannersContext";
import { CategoriesContext } from "@/contexts/CategoriesContext";
import { PromoContext } from "@/contexts/PromosContext";
import { useActivities } from "@/contexts/ActivitiesContext";
import Loading from "@/components/Loading";

export default function Home() {
  const [notification, setNotification] = useState(null);
  const { banners, loading: bannersLoading, error: bannersError } = useContext(BannersContext);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useContext(CategoriesContext);
  const { promos, loading: promosLoading, error: promosError } = useContext(PromoContext);
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivities();

  const token = getCookie("token");

  const [visibleCategories, setVisibleCategories] = useState(8);
  const loadMoreCategories = () => setVisibleCategories(visibleCategories + 8);

  const [currentSlide, setCurrentSlide] = useState(0);

  const sortActivitiesByReviews = (activities) => {
    return activities.sort((a, b) => b.total_reviews - a.total_reviews);
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

      setNotification({ message: response.data.message || "Item added to cart!", type: "success" });
      // Auto-dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 2000);
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

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(
        () => setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length),
        3000
      );
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (bannersLoading || categoriesLoading || promosLoading || activitiesLoading) return <Loading />;

  if (bannersError || categoriesError || promosError || activitiesError)
    return <p>Error: {bannersError || categoriesError || promosError || activitiesError}</p>;

  return (
    <section className="flex flex-col">
      {!token && (
        <div className="flex flex-col items-center justify-center p-4 text-[#F2F2F2] bg-[#F96D00] font-bold lg:hidden">
          <div className="flex flex-col items-center justify-center w-full max-w-[400px] gap-2">
            <p>Checkout now and get the promo!</p>
            <div className="flex items-center justify-between w-full gap-4 px-8">
              <Link
                href="/login"
                className="flex items-center justify-center w-full py-1 btn-1 border-2 border-[#F2F2F2]">
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center w-full py-1 btn-2 border-2 border-[#F2F2F2]">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Banners Section */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-200 md:h-[400px] lg:h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}>
            <img src={banner.imageUrl} alt={banner.name} className="object-cover w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-40">
              <h2 className="mb-4 text-3xl font-bold md:mb-8 md:text-5xl">{banner.name}</h2>
              <Link href="/categories">
                <button className="btn-1 md:text-xl md:px-12">Explore by See All Activites</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="relative flex flex-col px-8 mt-8 rounded-xl md:mt-12 md:px-12 lg:mx-32 lg:py-8 lg:border-2 lg:border-[#cecece]">
        <h2 className="mb-8 text-2xl font-bold text-center text-[#F96D00]">Categories</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {categories.slice(0, visibleCategories).map((category) => (
            <Link href={`/categories/${category.id}`} key={category.id}>
              <div className="flex flex-col items-center transition-transform hover:scale-105">
                <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] flex-center bg-[#F96D00] rounded-full shadow-md hover:shadow-lg">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-[80px] h-[80px] md:w-[110px] md:h-[110px] lg:w-[140px] lg:h-[140px] rounded-full"
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-center md:text-base">{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
        {visibleCategories < categories.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreCategories}
              className="px-6 py-2 text-white rounded-lg bg-[#F96D00] hover:bg-[#A03D00]">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Promos Section */}
      <div className="relative flex flex-col px-8 mt-8 rounded-xl md:mt-12 md:px-12 lg:mx-32 lg:py-8 lg:border-2 lg:border-[#cecece]">
        <h2 className="mb-8 text-2xl font-bold text-center text-[#F96D00]">Ongoing Promos</h2>
        <div className="flex gap-4 pb-4 overflow-x-auto">
          {promos.slice(0, 5).map((promo) => (
            <Link key={promo.id} href={`/promos/${promo.id}`}>
              <div className="w-[250px] h-[250px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#F96D00] hover:text-[#f2f2f2] transition-all duration-300">
                <h3 className="mb-2 text-lg font-semibold text-center">{promo.title}</h3>
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="object-cover w-full h-40 rounded-md"
                />
              </div>
            </Link>
          ))}
          <Link href="/promos">
            <div className="flex items-center justify-center w-full h-full p-4 bg-[#F96D00] hover:bg-[#A03D00] transition-all duration-300 rounded-lg shadow-md hover:shadow-lg">
              <p className="text-3xl font-semibold text-center text-[#f2f2f2]">View All Promos</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Trending Activities */}
      <div className="relative flex flex-col px-8 mt-8 rounded-xl md:mt-12 md:px-12 lg:mx-32 lg:pt-8 lg:py-4 lg:border-2 lg:border-[#cecece]">
        <h2 className="text-2xl font-bold text-center text-[#F96D00]">Trending Activities</h2>
        <div className="flex gap-4 p-8 overflow-x-auto">
          {sortActivitiesByReviews(activities.slice(0, 5)).map((activity) => {
            const priceAfterDiscount = activity.price - activity.price_discount;
            return (
              <div
                key={activity.id}
                className="flex-shrink-0 w-[250px] h-auto p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <Link href={`/activities/${activity.id}`}>
                  <img
                    src={activity.imageUrls[0]}
                    alt={activity.title}
                    className="object-cover w-full h-40 mb-2 rounded-md"
                  />
                </Link>
                <div className="flex flex-col">
                  <Link href={`/activities/${activity.id}`}>
                    <h3 className="text-lg font-semibold text-[#F96D00]">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.category.name}</p>
                  </Link>
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
                  <Link href={`/activities/${activity.id}`} className="w-full flex-center">
                    <button className="px-4 py-2 mt-2 text-white bg-[#F96D00] rounded-lg hover:bg-[#A03D00]">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
          <Link href="/categories">
            <div className="w-full h-full flex-center btn-1">
              <p className="text-3xl font-semibold text-center text-[#f2f2f2]">
                View All Activities
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Partnership Section */}
      <div className="relative flex mb-16 flex-col px-8 mt-8 rounded-xl md:mt-12 md:px-12 lg:mx-32 lg:py-8 lg:border-2 lg:border-[#cecece]">
        <h2 className="mb-8 text-2xl font-bold text-center text-[#F96D00]">Our Partners</h2>
        <div className="grid grid-cols-2 gap-x-0 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {[
            { id: 1, name: "Google", logo: <ion-icon name="logo-google"></ion-icon> },
            { id: 2, name: "Apple", logo: <ion-icon name="logo-apple"></ion-icon> },
            { id: 3, name: "Microsoft", logo: <ion-icon name="logo-microsoft"></ion-icon> },
            { id: 4, name: "Amazon", logo: <ion-icon name="logo-amazon"></ion-icon> },
            { id: 5, name: "Facebook", logo: <ion-icon name="logo-facebook"></ion-icon> },
            { id: 6, name: "PlayStation", logo: <ion-icon name="logo-playstation"></ion-icon> },
            { id: 7, name: "Xbox", logo: <ion-icon name="logo-xbox"></ion-icon> },
            { id: 8, name: "Steam", logo: <ion-icon name="logo-steam"></ion-icon> },
            { id: 9, name: "React", logo: <ion-icon name="logo-react"></ion-icon> },
            { id: 10, name: "Figma", logo: <ion-icon name="logo-figma"></ion-icon> },
          ].map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-4 transition-all duration-300 bg-white border rounded-full shadow-md hover:scale-125 hover:shadow-xl">
              <div className="text-6xl flex-center">{partner.logo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
