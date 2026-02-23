import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { logout, loginSuccess } from "./store/authSlice";
import axios from "axios";
import {
  Package,
  MapPin,
  HeadphonesIcon,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Pencil,
  Star,
  Home,
  Briefcase,
  MoreHorizontal,
  CheckCircle,
  XCircle,
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

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
      </div>
    );

  if (error)
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

  if (orders.length === 0)
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

// ── Profile Section ───────────────────────────────────────────────
function ProfileSection({ user, token }) {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  const [form, setForm] = useState({ name: "", email: "" });

  const startEditing = () => {
    setForm({ name: user?.name || "", email: user?.email || "" });
    setToast(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setToast(null);
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_BASE}/auth/update-profile`,
        {
          name: form.name.trim() || undefined,
          email: form.email.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data?.success) {
        // Refresh both token + user in Redux & localStorage in one shot
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
        setEditing(false);
        showToast("success", "Profile updated successfully!");
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profile Details</h3>

        {!editing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm font-medium border ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Fields ── */}
      <div className="space-y-3">
        {/* Name */}
        <div className="flex justify-between items-center border rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500 font-medium">Full Name</span>
          {editing ? (
            <input
              type="text"
              value={form.name}
              placeholder="Your full name"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="text-sm font-semibold text-gray-800 text-right border-b border-red-300 focus:outline-none bg-transparent w-48"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-800">
              {user?.name || "—"}
            </span>
          )}
        </div>

        {/* Phone — never editable (it's the login identity) */}
        <div className="flex justify-between items-center border rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500 font-medium">Phone</span>
          <span className="text-sm font-semibold text-gray-800">
            {user?.phoneNumber || user?.phone || "—"}
          </span>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center border rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500 font-medium">Email</span>
          {editing ? (
            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="text-sm font-semibold text-gray-800 text-right border-b border-red-300 focus:outline-none bg-transparent w-48"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-800">
              {user?.email || "—"}
            </span>
          )}
        </div>

        {/* Role — always read-only */}
        {/* <div className="flex justify-between items-center border rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500 font-medium">Role</span>
          <span className="text-sm font-semibold text-gray-800">
            {user?.role || "USER"}
          </span>
        </div> */}
      </div>
    </div>
  );
}

// ── Label icon helper ─────────────────────────────────────────────
const LabelIcon = ({ label }) => {
  if (label === "Home") return <Home className="w-4 h-4" />;
  if (label === "Work") return <Briefcase className="w-4 h-4" />;
  return <MoreHorizontal className="w-4 h-4" />;
};

const LABEL_COLORS = {
  Home: "bg-blue-100 text-blue-700",
  Work: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-600",
};

const EMPTY_FORM = {
  label: "Home",
  street: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

// ── Addresses Section ─────────────────────────────────────────────
function AddressesSection({ token }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/auth/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data?.addresses || []);
    } catch (err) {
      console.error(err);
      setError("Could not load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setEditingId(addr._id);
    setFormData({
      label: addr.label || "Home",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.phone || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  };

  const handleSubmit = async () => {
    setFormError("");
    if (
      !formData.street ||
      !formData.city ||
      !formData.pincode ||
      !formData.phone
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await axios.put(
          `${API_BASE}/auth/addresses/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data?.success)
          setAddresses((prev) =>
            prev.map((a) => (a._id === editingId ? res.data.address : a)),
          );
      } else {
        const res = await axios.post(`${API_BASE}/auth/addresses`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success)
          setAddresses((prev) => [...prev, res.data.address]);
      }
      cancelForm();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Failed to save address. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    setDeletingId(addressId);
    try {
      await axios.delete(`${API_BASE}/auth/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a._id !== addressId));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setSettingDefaultId(addressId);
    try {
      const res = await axios.patch(
        `${API_BASE}/auth/addresses/${addressId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.addresses) {
        setAddresses(res.data.addresses);
      } else {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a._id === addressId })),
        );
      }
    } catch (err) {
      console.error("Set default failed:", err);
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">
          Saved Addresses{" "}
          {!loading && (
            <span className="text-sm font-normal text-gray-400">
              ({addresses.length}/5)
            </span>
          )}
        </h3>
        {!showForm && addresses.length < 5 && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-4 flex items-center justify-between">
          {error}
          <button onClick={fetchAddresses} className="underline text-xs ml-2">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading addresses...
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <MapPin className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No saved addresses yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Add an address for faster checkout
          </p>
          <button
            onClick={openAddForm}
            className="mt-4 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add First Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border-2 rounded-xl p-4 transition-colors ${addr.isDefault ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${LABEL_COLORS[addr.label] || "bg-gray-100 text-gray-600"}`}
                  >
                    <LabelIcon label={addr.label} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${LABEL_COLORS[addr.label] || "bg-gray-100 text-gray-600"}`}
                      >
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-green-600 stroke-green-600" />{" "}
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {addr.street}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[addr.city, addr.state, addr.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      📞 {addr.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(addr)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      disabled={deletingId === addr._id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      {deletingId === addr._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      disabled={settingDefaultId === addr._id}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
                    >
                      {settingDefaultId === addr._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="mt-4 border-2 border-red-200 rounded-xl p-5 bg-red-50">
          <h4 className="font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h4>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Label
            </label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  onClick={() => setFormData({ ...formData, label: lbl })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${formData.label === lbl ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-300 hover:border-red-400"}`}
                >
                  <LabelIcon label={lbl} /> {lbl}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Street / House / Flat *
              </label>
              <input
                type="text"
                placeholder="e.g. 12A, Park Street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Patna"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Bihar"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                placeholder="e.g. 800001"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
              />
            </div>
          </div>
          {formError && (
            <p className="mt-3 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg">
              ⚠️ {formError}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingId ? "Update Address" : "Save Address"}
            </button>
            <button
              onClick={cancelForm}
              disabled={submitting}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Support Section ───────────────────────────────────────────────
function SupportSection() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    category: "",
    query: "",
  });

  const handleSubmit = () => {
    if (!formData.orderId || !formData.query) return alert("Fill all fields");
    setTickets([
      ...tickets,
      { id: Date.now(), ...formData, status: "Open", priority: "Medium" },
    ]);
    setShowForm(false);
    setFormData({ orderId: "", category: "", query: "" });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t.id} className="border rounded-xl p-4">
            <p className="font-semibold">
              {t.category} • {t.orderId}
            </p>
            <p className="text-sm text-gray-600">{t.query}</p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {t.status}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg"
      >
        + Raise New Ticket
      </button>
      {showForm && (
        <div className="mt-6 border p-4 rounded-xl bg-gray-50 space-y-3">
          <input
            placeholder="Order ID"
            className="w-full border p-2 rounded"
            value={formData.orderId}
            onChange={(e) =>
              setFormData({ ...formData, orderId: e.target.value })
            }
          />
          <input
            placeholder="Category"
            className="w-full border p-2 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <textarea
            placeholder="Describe your issue..."
            className="w-full border p-2 rounded"
            value={formData.query}
            onChange={(e) =>
              setFormData({ ...formData, query: e.target.value })
            }
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit Ticket
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
        return <ProfileSection user={user} token={token} />;
      case "Addresses":
        return <AddressesSection token={token} />;
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
      {/* ── Sidebar ── */}
      <div className="w-full md:w-72 flex-shrink-0">
        <div className="bg-white shadow rounded-2xl p-5 space-y-5">
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
                <Icon className="w-4 h-4 flex-shrink-0" /> {label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 bg-white shadow rounded-2xl p-6 min-h-[400px]">
        {renderSection()}
      </div>
    </div>
  );
}
