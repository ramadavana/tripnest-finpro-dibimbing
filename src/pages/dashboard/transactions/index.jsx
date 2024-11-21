import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function DashboardTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = getCookie("token");
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedTransactionByOrderDate = response.data.data.sort((a, b) => {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          return dateB - dateA;
        });
        setTransactions(sortedTransactionByOrderDate);
        setFilteredTransactions(sortedTransactionByOrderDate);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Fungsi untuk menangani perubahan filter status
  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    setCurrentPage(1); // Reset halaman ke awal

    let filteredData = transactions;
    if (selectedStatus !== "all") {
      filteredData = transactions.filter((transaction) => transaction.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      filteredData = filteredData.filter((transaction) =>
        transaction.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filteredData);
  };

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset halaman ke awal

    let filteredData = transactions;
    if (statusFilter !== "all") {
      filteredData = transactions.filter((transaction) => transaction.status === statusFilter);
    }

    if (query.trim()) {
      filteredData = filteredData.filter((transaction) =>
        transaction.invoiceId.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredTransactions(filteredData);
  };

  // Fungsi untuk mendapatkan data berdasarkan halaman
  const paginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Fungsi untuk menghitung jumlah halaman
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8 ml-16 transition-all duration-300 bg-gray-100">
        <h1 className="mb-4 text-3xl font-bold">All Transactions</h1>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Invoice ID..."
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="mr-2 font-semibold">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="p-2 border rounded">
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <table className="w-full mt-6 text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Invoice ID</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Order Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData().length > 0 ? (
              paginatedData().map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-100">
                  <td className="p-2 border">{transaction.invoiceId}</td>
                  <td className="p-2 border">
                    Rp
                    {formatCurrency(
                      transaction.transaction_items.reduce(
                        (total, item) => total + (item.price - item.price_discount) * item.quantity,
                        0
                      )
                    )}
                  </td>
                  <td className="p-2 capitalize border">{transaction.status}</td>
                  <td className="p-2 border">
                    {new Date(transaction.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <Link href={`/dashboard/transactions/${transaction.id}`}>
                      <button className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Detail
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 border">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
