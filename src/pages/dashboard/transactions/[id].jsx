/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = router.query; // Mengambil ID dari URL
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      const token = getCookie("token");
      try {
        const response = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransaction(response.data.data);
      } catch (error) {
        console.error("Failed to fetch transaction detail:", error);
        setError("Failed to fetch transaction detail.");
      }
    };

    if (id) {
      fetchTransactionDetail();
    }
  }, [id]);

  useEffect(() => {
    if (transaction) {
      setLoading(false);
    }
  }, [transaction]);

  const updateTransactionStatus = async (newStatus) => {
    const token = getCookie("token");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${id}`,
        { status: newStatus },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Perbarui state transaction setelah update status berhasil
      setTransaction((prev) => ({ ...prev, status: newStatus }));
      alert(`Transaction status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update transaction status:", error);
      alert("Failed to update transaction status. Please try again.");
    }
  };

  const handleConfirmPayment = () => {
    if (window.confirm("Are you sure you want to confirm this payment?")) {
      updateTransactionStatus("success");
    }
  };

  const handleDeclinePayment = () => {
    if (window.confirm("Are you sure you want to decline this payment?")) {
      updateTransactionStatus("failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Menentukan kelas berdasarkan status
  const statusClasses = {
    success:
      "bg-green-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md",
    pending:
      "bg-yellow-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md",
    cancelled:
      "bg-red-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md",
    failed:
      "bg-red-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md",
  };

  return (
    <div className="flex flex-col min-h-screen p-8 ml-16 bg-gray-100 w-fit">
      <h1 className="mb-4 text-3xl font-bold">Transaction Detail</h1>
      {transaction && (
        <div className="flex flex-col gap-2 p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Transaction ID: {transaction.id}</h2>
          <p>
            <strong>Payment Method ID:</strong> {transaction.paymentMethodId}
          </p>
          <p>
            <strong>Invoice ID:</strong> {transaction.invoiceId}
          </p>
          <p>
            <strong>Status:</strong>
            <span className={`inline-block px-2 py-1 rounded ${statusClasses[transaction.status]}`}>
              {transaction.status}
            </span>
          </p>
          <p>
            <strong>Total Amount:</strong> Rp
            {formatCurrency(
              transaction.transaction_items.reduce(
                (total, item) => total + (item.price - item.price_discount) * item.quantity,
                0
              )
            )}
          </p>
          <div>
            <strong>Proof of Payment:</strong>
            {transaction.proofPaymentUrl ? (
              <img src={transaction.proofPaymentUrl} alt="Proof of Payment" className="w-48 mt-2" />
            ) : (
              <p>File not found or not uploaded yet</p>
            )}
          </div>
          <p>
            <strong>Order Date:</strong> {new Date(transaction.orderDate).toLocaleString()}
          </p>
          <p>
            <strong>Expired Date:</strong> {new Date(transaction.expiredDate).toLocaleString()}
          </p>

          <h3 className="mt-4 text-lg font-semibold">Transaction Items</h3>
          <table className="min-w-full mt-2 border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price </th>
              </tr>
            </thead>
            <tbody>
              {transaction.transaction_items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="p-2 border">
                    <img src={item.imageUrls[0]} alt={item.title} className="w-16 h-16" />
                  </td>
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.description}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">
                    Rp{formatCurrency(item.price - item.price_discount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-2 mt-4">
            <h4 className="font-semibold">Payment Method</h4>
            <p>
              <strong>Name:</strong> {transaction.payment_method.name}
            </p>
            <p>
              <strong>Virtual Account Number:</strong>{" "}
              {transaction.payment_method.virtual_account_number}
            </p>
            <p>
              <strong>Virtual Account Name:</strong>{" "}
              {transaction.payment_method.virtual_account_name}
            </p>

            {transaction.status === "pending" && (
              <div className="flex flex-row w-full gap-2">
                <button
                  onClick={handleConfirmPayment}
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                  Confirm Payment
                </button>
                <button
                  onClick={handleDeclinePayment}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                  Decline Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
