"use client";

import React from "react";

const transactions = [
  {
    id: 1,
    user: "Kimutai",
    schedule: "25/04/06",
    route: "NRB/MARSABIT",
    bus: "Bus1",
    company: "Mashpoa",
    amount: 4500.0,
  },
  {
    id: 2,
    user: "Shirleen ",
    schedule: "19/02/25 ",
    route: "NRB/NAKURU",
    bus: "Bus2",
    company: "Metro",
    amount: 800.0,
  },
];

const TransactionsTable = () => {
  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h2 className="text-yellow-500 text-2xl font-bold mb-4">
        Customer Transactions
      </h2>
      <div className="w-full max-w-1xl border border-gray-700">
        <div className="grid grid-cols-5 bg-gray-800 text-yellow-500 font-bold p-3">
          <div>User</div>
          <div>Schedule</div>
          <div>Route</div>
          <div>Bus</div>
          <div>Company</div>
          <div>Amount (Ksh)</div>
        </div>
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={`grid grid-cols-5 p-3 ${
              index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
            } border-b border-gray-700`}
          >
            <div>{transaction.user}</div>
            <div>{transaction.schedule}</div>
            <div>{transaction.route}</div>
            <div>{transaction.bus}</div>
            <div>{transaction.company}</div>
            <div className="text-yellow-400 font-semibold">
              Ksh {transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;
