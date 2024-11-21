/* eslint-disable @next/next/no-img-element */
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Cart() {
  const { cartItems, loading, error } = useCart();
  const [quantities, setQuantities] = useState({});
  const [displayQuantities, setDisplayQuantities] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (cartItems) {
      const initialQuantities = {};
      cartItems.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });
      setDisplayQuantities(initialQuantities);
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const token = getCookie("token");
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        setPaymentMethods(response.data.data); // Simpan data metode pembayaran
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        alert("Failed to fetch payment methods.");
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full h-[75vh] flex items-center justify-center">
        <p>
          Your cart is empty.{" "}
          <Link href="/" className="nav-link-1 text-[#f96d00]">
            Shop now!
          </Link>
        </p>
      </div>
    );
  }

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleQuantityChange = (cartId, value) => {
    setQuantities((prev) => ({ ...prev, [cartId]: value }));
  };

  const deleteCartItem = async (cartId) => {
    const token = getCookie("token");

    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Failed to delete cart item:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to delete cart item.");
    }
  };

  const handleUpdateCart = async (cartId, quantity) => {
    const token = getCookie("token");

    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartId}`,
        { quantity },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDisplayQuantities((prev) => ({
        ...prev,
        [cartId]: quantity,
      }));

      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[cartId];
        return newQuantities;
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update cart.");
    }
  };

  const calculateSubtotal = (item) => {
    const quantity = displayQuantities[item.id] || item.quantity;
    const price = item.activity.price;
    const priceDiscount = item.activity.price_discount || 0; // Pastikan ada price_discount, jika tidak maka 0
    const finalPrice = price - priceDiscount; // Hitung harga setelah diskon
    return finalPrice * quantity; // Kalikan dengan kuantitas
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Menghitung subtotal untuk setiap item
      const itemSubtotal = calculateSubtotal(item);
      return total + itemSubtotal; // Jumlahkan hasil subtotal
    }, 0);
  };

  const handleCheckout = async () => {
    const token = getCookie("token");
    const cartIds = cartItems.map((item) => item.id); // Mengambil ID dari setiap item di keranjang
    const paymentMethodId = selectedPaymentMethod; // Menggunakan ID metode pembayaran yang dipilih

    if (!paymentMethodId) {
      alert("Please select a payment method before checking out.");
      return;
    }

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          cartIds, // Daftar ID item di keranjang
          paymentMethodId, // ID metode pembayaran yang dipilih
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/my-transaction"); // Arahkan ke halaman transaksi dengan ID yang baru dibuat
    } catch (error) {
      console.error(
        "Failed to create transaction:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to create transaction.");
    }
  };

  return (
    <section className="bg-[#f9f9f9] p-6 min-h-screen">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Cart Items */}
        <div className="col-span-2">
          <h1 className="mb-4 text-xl font-bold">Your Cart</h1>
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-white rounded shadow">
                <img
                  src={item.activity.imageUrls[0]}
                  alt={item.activity.title}
                  className="object-cover w-16 h-16 mr-4 rounded"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.activity.title}</h2>
                  <p className="text-sm text-gray-600">{item.activity.description}</p>
                  <p className="text-sm text-gray-800 line-through">
                    Price: Rp{formatCurrency(item.activity.price)}
                  </p>
                  <p className="text-sm text-[#f97d00] font-semibold">
                    Price: Rp
                    {formatCurrency(item.activity.price - item.activity.price_discount)}
                  </p>
                  <p className="text-sm text-gray-800">
                    Current Quantity: {displayQuantities[item.id] || item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    Subtotal: Rp{formatCurrency(calculateSubtotal(item))}
                  </p>
                </div>

                <div className="flex flex-col items-end ml-4">
                  <div className="flex items-center mb-2">
                    <label className="mr-2 text-sm">New Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || ""}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                      placeholder={displayQuantities[item.id] || item.quantity}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCart(item.id, quantities[item.id])}
                      disabled={!quantities[item.id]}
                      className={`px-4 py-2 text-white rounded ${
                        quantities[item.id]
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}>
                      Update
                    </button>
                    <button
                      onClick={() => deleteCartItem(item.id)}
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="p-6 bg-white rounded shadow">
          <h2 className="mb-4 text-xl font-bold">Cart Summary</h2>
          <p className="text-xl font-semibold text-[#f96d00]">
            Total: <span className="font-bold">Rp{formatCurrency(calculateTotal())}</span>
          </p>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold">Select Payment Method:</label>
            <select
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
              defaultValue="">
              <option value="" disabled>
                Select a payment method
              </option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
