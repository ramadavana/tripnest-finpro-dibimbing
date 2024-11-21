/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Kelas status untuk setiap tipe status transaksi
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
    const fetchTransactions = async () => {
      const token = getCookie("token"); // Ambil token dari cookies
      if (!token) {
        setError("You need to be logged in to view your transactions.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p className="mt-10 text-center">Loading your transactions...</p>;
  }

  if (error) {
    return <p className="mt-10 text-center text-red-500">{error}</p>;
  }

  if (transactions.length === 0) {
    return <p className="mt-10 text-center text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="max-w-screen-xl p-6 mx-auto bg-[#f2f2f2] min-h-[75vh]">
      <h1 className="mb-6 text-2xl font-bold text-center text-[#f96d00]">My Transactions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-4 border-collapse border-gray-300 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Invoice ID</th>
              <th className="px-4 py-2 text-left border-b">Payment Method</th>
              <th className="px-4 py-2 text-left border-b">Total Amount</th>
              <th className="px-4 py-2 text-left border-b">Payment Status</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b-2 border-gray-300">
                <td className="px-4 py-2">{transaction.invoiceId}</td>
                <td className="flex items-center px-4 py-2">
                  <img
                    src={transaction.payment_method.imageUrl}
                    alt={transaction.payment_method.name}
                    className="w-8 h-8 mr-2"
                  />
                  {transaction.payment_method.name}
                </td>
                <td className="px-4 py-2">
                  Rp
                  {formatCurrency(
                    transaction.transaction_items.reduce(
                      (total, item) => total + (item.price - item.price_discount) * item.quantity,
                      0
                    )
                  )}
                </td>
                <td className="px-4 py-2">
                  {/* Menambahkan kelas berdasarkan status transaksi */}
                  <span
                    className={statusClasses[transaction.status.toLowerCase()] || "text-gray-500"}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/my-transaction/${transaction.id}`}>
                    <button className="px-4 py-2 text-white bg-[#f96d00] rounded-lg hover:bg-[#A03D00]">
                      View Detail
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
