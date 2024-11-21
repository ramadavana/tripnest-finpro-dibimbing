/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useUploadImage } from "@/contexts/UploadImageContext";

export default function TransactionDetail() {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { uploadImage } = useUploadImage();

  const statusClasses = {
    success:
      "bg-green-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md px-3 py-2",
    pending:
      "bg-yellow-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md px-3 py-2",
    cancelled:
      "bg-red-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md px-3 py-2",
    failed:
      "bg-red-500 text-white font-bold uppercase text-sm tracking-widest ml-2 rounded-md shadow-md px-3 py-2",
  };

  useEffect(() => {
    if (!id) return;

    const fetchTransactionDetail = async () => {
      const token = getCookie("token");
      if (!token) {
        setError("You need to be logged in to view the transaction details.");
        setLoading(false);
        return;
      }

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
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transaction details. Please try again.");
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [id]);

  const handleUploadProof = async () => {
    if (!proofFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      setUploadError("You need to be logged in to upload proof of payment.");
      return;
    }

    setUploadLoading(true);
    try {
      const proofPaymentUrl = await uploadImage(proofFile);

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${id}`,
        { proofPaymentUrl },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadLoading(false);
      alert("Proof of payment uploaded successfully.");
      router.reload();
    } catch (err) {
      setUploadLoading(false);
      setUploadError("Failed to upload proof of payment. Please try again.");
    }
  };

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCancelTransaction = async () => {
    const token = getCookie("token");
    if (!token) {
      setCancelError("You need to be logged in to cancel the transaction.");
      return;
    }

    setCancelLoading(true);
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${id}`,
        {},
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCancelLoading(false);
      alert("Transaction successfully cancelled.");
      router.push("/my-transaction");
    } catch (err) {
      setCancelLoading(false);
      setCancelError("Failed to cancel the transaction. Please try again.");
    }
  };

  if (loading) {
    return <p className="mt-10 text-center">Loading transaction details...</p>;
  }

  if (error) {
    return <p className="mt-10 text-center text-red-500">{error}</p>;
  }

  if (!transaction) {
    return <p className="mt-10 text-center text-gray-500">Transaction not found.</p>;
  }

  const isProofUploadVisible = !["success", "cancelled", "failed"].includes(transaction.status);

  return (
    <div className="max-w-screen-xl min-h-[75vh] p-6 mx-auto bg-[#f2f2f2]">
      <h1 className="mb-6 text-2xl font-bold text-center text-[#f96d00]">Transaction Detail</h1>

      <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded-lg shadow-md md:grid-cols-3">
        {/* Overview Section */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold text-[#f96d00]">Transaction Overview</h3>
          <div className="flex flex-col gap-4 mt-4">
            <p>
              <strong>Invoice ID:</strong> {transaction.invoiceId}
            </p>
            <p>
              <strong>Payment Method:</strong> {transaction.payment_method.name}
            </p>
            <p>
              <strong>Virtual Account Number:</strong>{" "}
              {transaction.payment_method.virtual_account_number}
            </p>
            <p>
              <strong>Virtual Account Name:</strong>{" "}
              {transaction.payment_method.virtual_account_name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={statusClasses[transaction.status]}>{transaction.status}</span>
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
            {transaction.proofPaymentUrl && (
              <div>
                <strong>Proof of Payment:</strong>
                <a
                  href={transaction.proofPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 underline">
                  View Proof of Payment
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        {isProofUploadVisible && (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files[0])}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f96d00]"
            />
            <button
              onClick={handleUploadProof}
              className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={uploadLoading}>
              {uploadLoading ? "Uploading..." : "Upload Payment Proof"}
            </button>
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            <button
              onClick={handleCancelTransaction}
              className="w-full px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              disabled={cancelLoading}>
              {cancelLoading ? "Canceling..." : "Cancel Transaction"}
            </button>
            {cancelError && <p className="text-red-500">{cancelError}</p>}
          </div>
        )}
      </div>

      <h3 className="mt-8 text-xl font-semibold text-[#f96d00]">Transaction Items</h3>
      {transaction.transaction_items.map((item) => {
        const priceAfterDiscount = item.price - item.price_discount;
        return (
          <div
            key={item.id}
            className="flex items-center p-4 mt-4 space-x-4 bg-white rounded-lg shadow-md">
            <img
              src={item.imageUrls[0]}
              alt={item.title}
              className="object-cover w-24 h-24 rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Quantity: {item.quantity}</p>
              <div className="mt-2">
                <p className="text-gray-400 line-through">Rp{item.price.toLocaleString("id-ID")}</p>
                <p className="text-lg font-bold text-[#f96d00]">
                  Rp{priceAfterDiscount.toLocaleString("id-ID")}
                </p>

                <p className="text-lg font-bold">
                  Total:{" "}
                  <span className="text-lg font-bold text-[#f96d00]">
                    Rp{(priceAfterDiscount * item.quantity).toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
