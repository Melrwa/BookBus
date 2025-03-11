"use client";

import React, { useState, useEffect } from "react";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/admin/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }

        const data = await response.json();
        console.log("Fetched Transactions:", data); // Log the response

        // If data is wrapped inside an object, extract it properly
        const transactionsArray = Array.isArray(data) ? data : data.transactions || [];
        setTransactions(transactionsArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-yellow-500 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Customer Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-400">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Amount Paid (Ksh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.id || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.booking_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-yellow-400">
                    Ksh {transaction.amount_paid?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.payment_date || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.payment_method || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;