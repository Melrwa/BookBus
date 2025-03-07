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
        const response = await fetch("/api/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is stored in localStorage
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }

        const data = await response.json();
        setTransactions(data.transactions); // Assuming the response has a `transactions` field
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
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
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h2 className="text-yellow-500 text-2xl font-bold mb-4">
        Customer Transactions
      </h2>
      <div className="w-full max-w-1xl border border-gray-700">
        <div className="grid grid-cols-6 bg-gray-800 text-yellow-500 font-bold p-3">
          <div>User</div>
          <div>Schedule</div>
          <div>Route</div>
          <div>Bus</div>
          <div>Company</div>
          <div>Amount (Ksh)</div>
        </div>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`grid grid-cols-6 p-3 ${
                index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              } border-b border-gray-700`}
            >
              <div>{transaction.user_id}</div>
              <div>{transaction.schedule_id}</div>
              <div>{transaction.bus_id}</div>
              <div>{transaction.company_id}</div>
              <div>{transaction.total_amount}</div>
              <div className="text-yellow-400 font-semibold">
                Ksh {transaction.total_amount.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 p-3">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;