"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPayment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { bookingId } = router.query;

  // Set loading to false once bookingId is available
  useEffect(() => {
    if (bookingId) {
      setLoading(false);
    }
  }, [bookingId]);

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!bookingId) return; // Exit if bookingId is not yet available

    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirm_payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Payment confirmed!");
        router.push("/userhomepage/mybookings");
      } else {
        alert("Failed to confirm payment.");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
    }
  };

  // Show loading state while waiting for bookingId
  if (!bookingId || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">Confirm Payment</h1>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="p-2 rounded-lg bg-gray-800 text-white"
      >
        <option value="">Select Payment Method</option>
        <option value="M-Pesa">M-Pesa</option>
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>
      <button
        onClick={handleConfirmPayment}
        className="mt-4 bg-red-500 px-6 py-2 rounded-lg text-white"
      >
        Confirm Payment
      </button>
    </div>
  );
}