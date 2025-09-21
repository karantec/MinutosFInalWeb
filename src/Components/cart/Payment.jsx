import React, { useState } from "react";

export default function PaymentPage() {
  const [selected, setSelected] = useState("upi");
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  const paymentOptions = [
    { id: "upi", label: "UPI (GPay, PhonePe, Paytm)", icon: "📱" },
    { id: "card", label: "Credit / Debit Card", icon: "💳" },
    { id: "cod", label: "Cash on Delivery", icon: "💵" },
    { id: "wallet", label: "Wallets", icon: "💰" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>

      <div className="space-y-4 mb-6">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
              selected === option.id
                ? "border-red-500 bg-red-50 shadow-md"
                : "border-gray-300 hover:shadow hover:bg-white"
            }`}
          >
            <span className="flex items-center gap-3 text-gray-800 font-medium">
              <span className="text-2xl">{option.icon}</span>
              {option.label}
            </span>
            {selected === option.id && <span className="text-red-600 font-bold text-xl">✔</span>}
          </div>
        ))}
      </div>

      {/* Conditional Inputs */}
      {selected === "card" && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 space-y-4">
          <h3 className="font-semibold text-gray-700">Enter Card Details</h3>
          <input
            type="text"
            placeholder="Card Number"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="text"
            placeholder="Card Holder Name"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Expiry MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              className="w-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
      )}

      {selected === "upi" && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Enter UPI ID</h3>
          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      )}

      <button
        onClick={() => alert(`Payment method selected: ${selected}`)}
        className="w-full mt-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
      >
        Confirm & Place Order
      </button>
    </div>
  );
}
