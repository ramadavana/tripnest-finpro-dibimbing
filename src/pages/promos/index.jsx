/* eslint-disable @next/next/no-img-element */
import Loading from "@/components/Loading";
import { PromoContext } from "@/contexts/PromosContext";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function Promos() {
  const { promos, loading: promosLoading, error: promosError } = useContext(PromoContext);
  const router = useRouter();

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleNavigateToCategories = () => {
    router.push("/categories");
  };

  const handleNavigateToPromoDetail = (id) => {
    router.push(`/promos/${id}`);
  };

  if (promosLoading) return <Loading />;
  if (promosError) return <p className="text-center text-red-600">Error: {promosError}</p>;

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-screen-xl px-6 mx-auto">
        {/* Header */}
        <h2 className="mb-8 text-4xl font-bold text-center text-[#F96D00]">Our Best Deals</h2>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
              {/* Promo Title */}
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{promo.title}</h3>

              {/* Promo Image */}
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="object-cover w-full h-40 mb-4 rounded-md"
              />

              {/* Promo Details */}
              <p className="mb-2 text-sm text-gray-600">{promo.description}</p>
              <p className="text-sm font-medium text-gray-700">
                <span className="font-semibold">Code:</span> {promo.promo_code}
              </p>
              <p className="text-sm font-medium text-gray-700">
                <span className="font-semibold">Discount:</span> Rp
                {formatCurrency(promo.promo_discount_price)}
              </p>
              <p className="text-sm font-medium text-gray-700">
                <span className="font-semibold">Min. Claim:</span> Rp
                {formatCurrency(promo.minimum_claim_price)}
              </p>

              {/* Claim Button */}
              <div>
                <button
                  onClick={handleNavigateToCategories}
                  className="mt-4 w-full py-2 px-4 bg-[#F96D00] text-white font-semibold rounded-md hover:bg-[#d35b00] transition-colors duration-300">
                  Shop Now!
                </button>

                <button
                  onClick={() => handleNavigateToPromoDetail(promo.id)}
                  className="mt-4 w-full py-2 px-4 bg-[#393e46] text-white font-semibold rounded-md hover:bg-[#222831] transition-colors duration-300">
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
