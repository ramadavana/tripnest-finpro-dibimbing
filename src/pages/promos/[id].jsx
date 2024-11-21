/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePromoById } from "@/contexts/PromoByIdContext";
import Link from "next/link";

export default function PromoDetail() {
  const router = useRouter();
  const { id } = router.query;

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const { promo, fetchPromoById, loading, error } = usePromoById();

  useEffect(() => {
    if (id) {
      fetchPromoById(id); // Ambil data promo berdasarkan ID
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-700">Loading promo details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl p-6 mx-auto sm:p-8 md:p-12 lg:p-16">
      {promo && (
        <>
          {/* Promo Title */}
          <h1 className="mb-6 text-4xl font-bold text-center text-[#F96D00]">{promo.title}</h1>

          {/* Promo Image */}
          <div className="flex justify-center mb-6">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="object-cover w-full max-w-3xl rounded-md shadow-lg"
            />
          </div>

          {/* Promo Details */}
          <div className="p-6 bg-white rounded-md shadow-md">
            <p className="mb-4 text-lg text-gray-700">{promo.description}</p>
            <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2">
              <p>
                <strong className="font-medium text-gray-900">Promo Code:</strong>{" "}
                {promo.promo_code}
              </p>
              <p>
                <strong className="font-medium text-gray-900">Discount:</strong> Rp
                {formatCurrency(promo.promo_discount_price)}
              </p>
              <p>
                <strong className="font-medium text-gray-900">Minimum Claim:</strong> Rp
                {formatCurrency(promo.minimum_claim_price)}
              </p>
              <p>
                <strong className="font-medium text-gray-900">Terms & Conditions:</strong>{" "}
                {formatCurrency(promo.terms_condition)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-10">
            <Link href="/categories">
              <button className="py-3 px-6 text-lg font-semibold text-white bg-[#F96D00] rounded-md shadow-md hover:bg-[#d35b00] transition-all duration-300">
                Checkout Now!
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
