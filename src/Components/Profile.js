import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("Orders");

  // Dummy Data
  const dummyOrders = [
    {
      id: "ORD12345",
      date: "20 Sept 2025",
      status: "Delivered",
      total: 349,
      items: ["Amul Milk 1L", "Parle-G Biscuit 500g"],
    },
    {
      id: "ORD12346",
      date: "18 Sept 2025",
      status: "Ongoing",
      total: 220,
      items: ["Banana 1kg", "Fortune Oil 1L"],
    },
  ];

  const dummyAddresses = [
    {
      type: "Home",
      details: "123, MG Road, Ranchi - 834001",
    },
    {
      type: "Office",
      details: "LetsCode Pvt Ltd, Hinoo, Ranchi",
    },
  ];

  const dummySupport = [
    { id: 1, query: "Order not delivered", status: "Resolved" },
    { id: 2, query: "Wallet refund not received", status: "Pending" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Orders":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-3">My Orders</h3>
            <div className="space-y-4">
              {dummyOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.date} • {order.status}
                    </p>
                    <p className="text-sm mt-1 text-gray-700">
                      {order.items.join(", ")}
                    </p>
                  </div>
                  <div className="font-semibold">₹{order.total}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Addresses":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>
            <div className="space-y-4">
              {dummyAddresses.map((addr, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{addr.type}</p>
                    <p className="text-sm text-gray-600">{addr.details}</p>
                  </div>
                  <button className="text-red-500 text-sm font-medium">
                    Edit
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold">
              Add New Address
            </button>
          </div>
        );

      case "Customer Support":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-3">Support Tickets</h3>
            <div className="space-y-4">
              {dummySupport.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 flex justify-between"
                >
                  <p>{ticket.query}</p>
                  <span
                    className={`text-sm font-medium ${
                      ticket.status === "Resolved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold">
              Raise New Ticket
            </button>
          </div>
        );

      case "Profile":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-3">Profile Details</h3>
            <div className="space-y-2 text-left">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {user?.name || "Guest"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user?.phoneNumber || "N/A"}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {user?.email || "guest@example.com"}
              </p>
            </div>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold">
              Edit Profile
            </button>
          </div>
        );

      default:
        return <p className="text-gray-500">Select a section</p>;
    }
  };

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
          <p className="text-gray-500 text-sm">
            {user?.phoneNumber || "No number"}
          </p>
        </div>
        {/* Sidebar Menu */}
        <div className="space-y-2">
          {["Orders", "Customer Support", "Addresses", "Profile"].map(
            (item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSection(item)}
                className={`w-full text-left px-3 py-2 rounded font-medium ${
                  activeSection === item
                    ? "bg-red-100 text-red-700"
                    : "hover:bg-red-50 text-gray-700"
                }`}
              >
                {item}
              </button>
            )
          )}
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
      <div className="flex-1 bg-white shadow rounded-xl p-6">
        {renderSection()}
      </div>
    </div>
  );
}
