import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-5 space-y-5">
        {/* Profile Info */}
        <div className="flex flex-col items-start">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h2 className="mt-2 font-semibold text-lg">
            {user?.name || "Guest"}
          </h2>
          <p className="text-gray-500 text-sm">{user?.phone || "No number"}</p>
        </div>

        {/* Daily Saver Card */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-700">
            You could potentially save ₹500 per month with Daily Saver
          </p>
          <button className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded font-semibold">
            Get Daily
          </button>
        </div>

        {/* Wallet Section */}
        <div className="border rounded-lg p-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Wallet Balance</span>
            <span className="text-gray-700">₹{user?.wallet || 0}</span>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
            Add Balance
          </button>
        </div>

        {/* Free Cash */}
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex justify-between items-center">
          <span className="text-red-700 font-medium">Free Cash</span>
          <span className="font-semibold text-red-800">₹150</span>
        </div>

        {/* Sidebar Menu */}
        <div className="space-y-2">
          {[
            "Orders",
            "Customer Support",
            "Manage Referrals",
            "Addresses",
            "Profile",
          ].map((item, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 rounded hover:bg-red-50 font-medium text-gray-700"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => dispatch(logout())}
          className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
        >
          Log Out
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white shadow rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
          alt="No Orders"
          className="w-20 h-20 mb-4"
        />
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-sm text-gray-500 mb-3">
          Browse products and add them to your cart
        </p>
        <button className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold">
          Browse Products
        </button>
      </div>
    </div>
  );
}
