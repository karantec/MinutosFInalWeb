import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import axios from "axios";
import {
  Package,
  MapPin,
  HeadphonesIcon,
  User,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Store,
} from "lucide-react";
import { useAppDispatch } from "./hooks/useAppDispatch";

const API_BASE = "https://api.minutos.in/api";

const STATUS_STYLES = {
  PLACED: { color: "bg-blue-100 text-blue-700", label: "Placed" },
  ACCEPTED: { color: "bg-yellow-100 text-yellow-700", label: "Accepted" },
  COMPLETED: { color: "bg-green-100 text-green-700", label: "Completed" },
  REJECTED: { color: "bg-red-100 text-red-700", label: "Rejected" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || {
    color: "bg-gray-100 text-gray-600",
    label: status,
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}
    >
      {s.label}
    </span>
  );
};

// ── Orders Section ────────────────────────────────────────────────
function OrdersSection({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/order/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="w-14 h-14 text-gray-300 mb-4" />
        <h4 className="text-lg font-semibold text-gray-700 mb-1">
          No orders yet
        </h4>
        <p className="text-gray-400 text-sm">
          Your placed orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        My Orders ({orders.length})
      </h3>
      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order._id;
          return (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order._id)}
                className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(order.createdAt)}
                      {order.vendor?.businessName && (
                        <>
                          {" "}
                          ·{" "}
                          <span className="text-gray-600">
                            {order.vendor.businessName}
                          </span>
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-bold text-gray-800">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded: Order Items */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Items Ordered
                  </p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                            <Package className="w-3.5 h-3.5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                              {item.name ||
                                item.product?.name ||
                                item.product?.productName ||
                                "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Delivery Address
                      </p>
                      <p className="text-sm text-gray-700">
                        {[
                          order.shippingAddress.street,
                          order.shippingAddress.city,
                          order.shippingAddress.state,
                          order.shippingAddress.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {order.shippingAddress.phone && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          📞 {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-base font-bold text-red-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile Details Section ───────────────────────────────────────
function ProfileSection({ user }) {
  const fields = [
    { label: "First Name", value: user?.firstName || user?.name || "—" },
    { label: "Last Name", value: user?.lastName || "—" },
    { label: "Phone", value: user?.phone || user?.phoneNumber || "—" },
    { label: "Email", value: user?.email || "—" },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
      <div className="space-y-3">
        {fields.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center border rounded-xl px-4 py-3"
          >
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
        Edit Profile
      </button>
    </div>
  );
}

// ── Addresses Section ─────────────────────────────────────────────
function AddressesSection() {
  const dummyAddresses = [
    { type: "Home", details: "123, MG Road, Ranchi - 834001" },
    { type: "Office", details: "LetsCode Pvt Ltd, Hinoo, Ranchi" },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>
      <div className="space-y-3">
        {dummyAddresses.map((addr, i) => (
          <div
            key={i}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{addr.type}</p>
              <p className="text-sm text-gray-500 mt-0.5">{addr.details}</p>
            </div>
            <button className="text-red-500 text-sm font-medium hover:text-red-700">
              Edit
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
        + Add New Address
      </button>
    </div>
  );
}

// ── Support Section ───────────────────────────────────────────────
function SupportSection() {
  const tickets = [
    { id: 1, query: "Order not delivered", status: "Resolved" },
    { id: 2, query: "Wallet refund not received", status: "Pending" },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Support Tickets</h3>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <p className="text-sm text-gray-800">{t.query}</p>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                t.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
        Raise New Ticket
      </button>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────
export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const [activeSection, setActiveSection] = useState("Orders");

  const menuItems = [
    { label: "Orders", Icon: Package },
    { label: "Profile", Icon: User },
    { label: "Addresses", Icon: MapPin },
    { label: "Customer Support", Icon: HeadphonesIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Orders":
        return <OrdersSection token={token} />;
      case "Profile":
        return <ProfileSection user={user} />;
      case "Addresses":
        return <AddressesSection />;
      case "Customer Support":
        return <SupportSection />;
      default:
        return null;
    }
  };

  const initials = (
    user?.firstName?.[0] ||
    user?.name?.[0] ||
    "U"
  ).toUpperCase();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    "Guest";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <div className="w-full md:w-72 flex-shrink-0">
        <div className="bg-white shadow rounded-2xl p-5 space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-gray-800 truncate">
                {displayName}
              </h2>
              <p className="text-gray-500 text-xs truncate">
                {user?.phone ||
                  user?.phoneNumber ||
                  user?.email ||
                  "No contact"}
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1">
            {menuItems.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setActiveSection(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  activeSection === label
                    ? "bg-red-100 text-red-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 bg-white shadow rounded-2xl p-6 min-h-[400px]">
        {renderSection()}
      </div>
    </div>
  );
}
