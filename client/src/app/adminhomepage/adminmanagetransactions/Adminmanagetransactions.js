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
        const response = await fetch("/api/admin/transactions"); // No auth token

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
    return <p className="text-gray-400 mt-4">Loading transactions...</p>;
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
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">
                  Amount (Ksh)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.user_id || transaction.userId || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.schedule_id || transaction.scheduleId || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.route || transaction.route_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.bus_id || transaction.busNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {transaction.company_id || transaction.companyName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-yellow-400">
                    Ksh {transaction.total_amount?.toFixed(2) || "0.00"}
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
