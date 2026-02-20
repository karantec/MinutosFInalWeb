import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Lock,
  ShoppingBag,
  MapPin,
  Phone,
  ChevronDown,
  Store,
  Loader2,
  Plus,
  Trash2,
  BookMarked,
  Home,
  Briefcase,
  MoreHorizontal,
  Star,
  AlertCircle,
  ChevronRight,
  Package,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// ─────────────────────────────────────────────────────────────────
// CONFIG — change to "https://api.minutos.in/api" for production
// ─────────────────────────────────────────────────────────────────
const API_BASE = "https://api.minutos.in/api"; // ✅ FIXED: was pointing to production

const authApi = axios.create({ baseURL: `${API_BASE}/auth` });
const mainApi = axios.create({ baseURL: API_BASE });

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
const LABEL_META = {
  Home: { color: "bg-sky-50 text-sky-700 border-sky-200", icon: Home },
  Work: {
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Briefcase,
  },
  Other: {
    color: "bg-slate-50 text-slate-600 border-slate-200",
    icon: MoreHorizontal,
  },
};

const LabelBadge = ({ label, showIcon = true }) => {
  const meta = LABEL_META[label] || LABEL_META.Other;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}
    >
      {showIcon && <Icon className="w-2.5 h-2.5" />}
      {label || "Address"}
    </span>
  );
};

const STEPS = ["Vendor", "Address", "Payment"];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : active ? "bg-red-600 text-white shadow-md shadow-red-200 ring-4 ring-red-100" : "bg-gray-100 text-gray-400"}`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:block ${active ? "text-red-600" : done ? "text-emerald-600" : "text-gray-400"}`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${done ? "bg-emerald-400" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {badge}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function PaymentCheckout() {
  const navigate = useNavigate();

  const { user, token } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  const [step, setStep] = useState(0);

  // Vendor
  const [vendors, setVendors] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorError, setVendorError] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorOpen, setVendorOpen] = useState(false);
  const vendorRef = useRef(null);

  // Address
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [addrMode, setAddrMode] = useState("saved");
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [addrLabel, setAddrLabel] = useState("Home");
  const [deletingId, setDeletingId] = useState(null);
  const [newAddr, setNewAddr] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  // Order
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!cartItems?.length) {
      navigate("/checkout");
      return;
    }
    loadVendors();
    loadAddresses();
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (vendorRef.current && !vendorRef.current.contains(e.target))
        setVendorOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const loadVendors = async () => {
    try {
      setVendorLoading(true);
      setVendorError("");
      const res = await mainApi.get("/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw?.vendors || raw?.data || [];
      setVendors(list);
    } catch {
      setVendorError("Could not load vendors. Please retry.");
    } finally {
      setVendorLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setAddrLoading(true);
      const res = await authApi.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.addresses || [];
      setSavedAddresses(list);
      if (list.length > 0) {
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddrId(def._id);
        setAddrMode("saved");
      } else {
        setAddrMode("new");
      }
    } catch {
      setAddrMode("new");
    } finally {
      setAddrLoading(false);
    }
  };

  const deleteAddress = async (id, e) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await authApi.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const next = savedAddresses.filter((a) => a._id !== id);
      setSavedAddresses(next);
      if (selectedAddrId === id) {
        setSelectedAddrId(next[0]?._id || null);
        if (!next.length) setAddrMode("new");
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const subtotal = (cartItems || []).reduce(
    (s, i) => s + (i.price || 0) * (i.quantity || 0),
    0,
  );
  const total = subtotal;

  const formatCard = (field, val) => {
    if (field === "number") {
      val = val
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    } else if (field === "expiry") {
      val = val.replace(/\D/g, "").slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    } else if (field === "cvv") {
      val = val.replace(/\D/g, "").slice(0, 3);
    }
    setCard((prev) => ({ ...prev, [field]: val }));
  };

  const canProceedStep0 = !!selectedVendor;
  const canProceedStep1 = (() => {
    if (addrMode === "saved") return !!selectedAddrId;
    return newAddr.street && newAddr.city && newAddr.pincode && newAddr.phone;
  })();
  const canProceedStep2 = !!paymentMethod;

  const effectiveAddress =
    addrMode === "saved"
      ? savedAddresses.find((a) => a._id === selectedAddrId)
      : newAddr;

  // ─────────────────────────────────────────────────────────────
  // PLACE ORDER + RAZORPAY
  // ─────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    setGlobalError("");
    if (!canProceedStep0 || !canProceedStep1 || !canProceedStep2) {
      setGlobalError("Please complete all sections before placing your order.");
      return;
    }

    const addr = effectiveAddress;

    // Optionally persist new address
    if (addrMode === "new" && saveToProfile) {
      try {
        const r = await authApi.post(
          "/addresses",
          { ...addr, label: addrLabel },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (r.data?.address) setSavedAddresses((p) => [...p, r.data.address]);
      } catch {
        /* non-blocking */
      }
    }

    const payload = {
      vendorId: selectedVendor._id,
      items: (cartItems || []).map((i) => ({
        product: i.productId || i.product?._id || i._id,
        quantity: i.quantity,
      })),
      shippingAddress: addr,
      paymentMethod,
      ...(addrMode === "saved" && { savedAddressId: selectedAddrId }),
    };

    setProcessing(true);
    try {
      // 1️⃣ Create order in DB
      const res = await mainApi.post("/order/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.success) {
        setGlobalError(
          res.data?.message || "Order creation failed. Please try again.",
        );
        setProcessing(false);
        return;
      }

      const createdOrder = res.data.order;

      // 2️⃣ COD → go straight to success
      if (paymentMethod === "cod") {
        setPlaced(createdOrder);
        setProcessing(false);
        return;
      }

      // 3️⃣ UPI / Card → open Razorpay
      const rzpRes = await mainApi.post(
        "/payment/create-order",
        { orderId: createdOrder._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { razorpayOrderId, amount, currency, key } = rzpRes.data;

      const options = {
        key,
        amount,
        currency,
        name: "Minutos",
        description: "Order Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
          contact: addr?.phone || "",
        },
        theme: { color: "#dc2626" },

        // ✅ Success: verify with backend
        handler: async (response) => {
          try {
            const verifyRes = await mainApi.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (verifyRes.data?.success) {
              setPlaced(verifyRes.data.order || createdOrder);
            } else {
              setGlobalError(
                "Payment verification failed. Please contact support.",
              );
            }
          } catch (err) {
            setGlobalError(
              "Payment done but verification failed. Please contact support.",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setGlobalError("Payment cancelled. You can retry from My Orders.");
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => {
        setGlobalError(`Payment failed: ${r.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setGlobalError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setProcessing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            Order Confirmed!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your order is headed to{" "}
            <span className="font-semibold text-gray-800">
              {selectedVendor?.businessName}
            </span>
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Clock className="w-4 h-4" /> Arriving in ~18 minutes
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 font-medium">
                Order ID
              </span>
              <span className="text-sm font-bold text-red-600 tracking-wide">
                #{placed._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 font-medium">
                Total Paid
              </span>
              <span className="text-sm font-bold text-gray-900">
                ₹{placed.totalAmount || total}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500 font-medium">Payment</span>
              <span className="text-sm font-semibold text-gray-700 capitalize">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod === "upi"
                    ? "UPI"
                    : "Card"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex-1 border-2 border-red-500 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all text-sm shadow-lg shadow-red-200"
            >
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <span className="font-black text-gray-900 text-sm">Checkout</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <StepBar current={step} />

        <div className="grid lg:grid-cols-5 gap-5">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-4">
            {/* STEP 0: VENDOR */}
            <Card
              className={`p-5 transition-all duration-300 ${step === 0 ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
            >
              <SectionHeader
                icon={Store}
                title="Select Vendor"
                subtitle="Choose who will fulfil your order"
                badge={
                  selectedVendor && step !== 0 ? (
                    <button
                      onClick={() => setStep(0)}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  ) : null
                }
              />
              {selectedVendor && step !== 0 ? (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedVendor.businessName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {[selectedVendor.city, selectedVendor.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              ) : (
                <>
                  {vendorLoading ? (
                    <div className="flex items-center gap-3 text-gray-400 py-6 justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading vendors...</span>
                    </div>
                  ) : vendorError ? (
                    <div className="flex items-center justify-between bg-red-50 text-red-600 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> {vendorError}
                      </div>
                      <button
                        onClick={loadVendors}
                        className="text-xs font-semibold underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="relative" ref={vendorRef}>
                      <button
                        onClick={() => setVendorOpen((o) => !o)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 border-2 rounded-xl transition-all ${selectedVendor ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                      >
                        {selectedVendor ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <Store className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-800">
                                {selectedVendor.businessName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {[selectedVendor.city, selectedVendor.state]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Choose a vendor...
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${vendorOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {vendorOpen && (
                        <div className="absolute z-20 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl shadow-gray-200/80 max-h-60 overflow-y-auto">
                          {vendors.map((v) => (
                            <button
                              key={v._id}
                              onClick={() => {
                                setSelectedVendor(v);
                                setVendorOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${selectedVendor?._id === v._id ? "bg-red-50" : ""}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedVendor?._id === v._id ? "bg-red-100" : "bg-gray-100"}`}
                              >
                                <Store
                                  className={`w-4 h-4 ${selectedVendor?._id === v._id ? "text-red-500" : "text-gray-400"}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {v.businessName}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {v.businessType && (
                                    <span className="text-red-500 mr-1">
                                      {v.businessType} ·
                                    </span>
                                  )}
                                  {[v.area, v.city, v.state]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              </div>
                              {selectedVendor?._id === v._id && (
                                <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedVendor && (
                    <button
                      onClick={() => setStep(1)}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-200 text-sm"
                    >
                      Continue to Address <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </Card>

            {/* STEP 1: ADDRESS */}
            <Card
              className={`p-5 transition-all duration-300 ${step < 1 ? "opacity-60 pointer-events-none" : ""} ${step === 1 ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
            >
              <SectionHeader
                icon={MapPin}
                title="Delivery Address"
                subtitle="Where should we deliver?"
                badge={
                  canProceedStep1 && step > 1 ? (
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  ) : null
                }
              />
              {canProceedStep1 && step > 1 ? (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  {addrMode === "saved" && effectiveAddress ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <LabelBadge label={effectiveAddress.label} />
                        <p className="text-sm text-gray-700 mt-1">
                          {effectiveAddress.street}
                        </p>
                        <p className="text-xs text-gray-400">
                          {[
                            effectiveAddress.city,
                            effectiveAddress.state,
                            effectiveAddress.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                      <Check className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0 mt-0.5" />
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">
                          {newAddr.street}
                        </p>
                        <p className="text-xs text-gray-400">
                          {[newAddr.city, newAddr.state, newAddr.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                      <Check className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0 mt-0.5" />
                    </div>
                  )}
                </div>
              ) : step === 1 ? (
                <>
                  {(savedAddresses.length > 0 || addrLoading) && (
                    <div className="flex gap-2 mb-4">
                      {savedAddresses.length > 0 && (
                        <button
                          onClick={() => setAddrMode("saved")}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${addrMode === "saved" ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          <BookMarked className="w-3.5 h-3.5" /> Saved Addresses
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${addrMode === "saved" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                          >
                            {savedAddresses.length}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => setAddrMode("new")}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${addrMode === "new" ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        <Plus className="w-3.5 h-3.5" /> New Address
                      </button>
                    </div>
                  )}

                  {addrMode === "saved" && (
                    <div className="space-y-2">
                      {addrLoading ? (
                        <div className="flex items-center justify-center gap-2 text-gray-400 py-8">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Loading addresses...</span>
                        </div>
                      ) : savedAddresses.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                          <p className="text-sm">No saved addresses</p>
                          <button
                            onClick={() => setAddrMode("new")}
                            className="text-xs text-red-500 font-semibold mt-1 hover:underline"
                          >
                            Add one now
                          </button>
                        </div>
                      ) : (
                        savedAddresses.map((addr) => {
                          const isSelected = selectedAddrId === addr._id;
                          return (
                            <div
                              key={addr._id}
                              onClick={() => setSelectedAddrId(addr._id)}
                              className={`group relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${isSelected ? "border-red-400 bg-red-50/50 shadow-sm" : "border-gray-150 bg-white hover:border-gray-300"}`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? "border-red-500 bg-red-500" : "border-gray-300"}`}
                                >
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <LabelBadge label={addr.label} />
                                    {addr.isDefault && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                                        <Star className="w-2.5 h-2.5 fill-emerald-500 stroke-emerald-500" />{" "}
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-gray-800 leading-tight truncate">
                                    {addr.street}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {[addr.city, addr.state, addr.pincode]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5" />{" "}
                                    {addr.phone}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => deleteAddress(addr._id, e)}
                                  disabled={deletingId === addr._id}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                                >
                                  {deletingId === addr._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {addrMode === "new" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Street / House / Flat *
                        </label>
                        <input
                          type="text"
                          value={newAddr.street}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, street: e.target.value })
                          }
                          placeholder="e.g. 12A, Park Street"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 placeholder-gray-300 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            value={newAddr.city}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, city: e.target.value })
                            }
                            placeholder="Patna"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 placeholder-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            value={newAddr.state}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, state: e.target.value })
                            }
                            placeholder="Bihar"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 placeholder-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={newAddr.pincode}
                            onChange={(e) =>
                              setNewAddr({
                                ...newAddr,
                                pincode: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              })
                            }
                            placeholder="800001"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 placeholder-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={newAddr.phone}
                            onChange={(e) =>
                              setNewAddr({
                                ...newAddr,
                                phone: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10),
                              })
                            }
                            placeholder="9876543210"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-gray-50 placeholder-gray-300"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveToProfile}
                            onChange={(e) => setSaveToProfile(e.target.checked)}
                            className="w-4 h-4 accent-red-600"
                          />
                          <div>
                            <p className="text-xs font-semibold text-gray-700">
                              Save for future orders
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Syncs to your profile
                            </p>
                          </div>
                        </label>
                        {saveToProfile && (
                          <div className="mt-3 ml-7 flex gap-2">
                            {["Home", "Work", "Other"].map((lbl) => {
                              const meta = LABEL_META[lbl];
                              const Icon = meta.icon;
                              return (
                                <button
                                  key={lbl}
                                  onClick={() => setAddrLabel(lbl)}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${addrLabel === lbl ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-200" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
                                >
                                  <Icon className="w-3 h-3" /> {lbl}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {canProceedStep1 && (
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-200 text-sm"
                    >
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : null}
            </Card>

            {/* STEP 2: PAYMENT */}
            <Card
              className={`p-5 transition-all duration-300 ${step < 2 ? "opacity-60 pointer-events-none" : ""} ${step === 2 ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
            >
              <SectionHeader
                icon={Wallet}
                title="Payment Method"
                subtitle="How would you like to pay?"
              />
              <div className="space-y-3">
                {[
                  {
                    id: "card",
                    Icon: CreditCard,
                    label: "Credit / Debit Card",
                    sub: "Visa, Mastercard, RuPay — via Razorpay",
                  },
                  {
                    id: "upi",
                    Icon: Wallet,
                    label: "UPI",
                    sub: "GPay, PhonePe, Paytm — via Razorpay",
                  },
                  {
                    id: "cod",
                    Icon: Banknote,
                    label: "Cash on Delivery",
                    sub: "Pay when you receive",
                  },
                ].map(({ id, Icon, label, sub }) => (
                  <div key={id}>
                    <button
                      onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${paymentMethod === id ? "border-red-400 bg-red-50/40 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === id ? "bg-red-600" : "bg-gray-100"}`}
                      >
                        <Icon
                          className={`w-5 h-5 ${paymentMethod === id ? "text-white" : "text-gray-400"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${paymentMethod === id ? "border-red-500 bg-red-500" : "border-gray-300"}`}
                      >
                        {paymentMethod === id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                    {/* Card/UPI info note — Razorpay handles actual input */}
                    {id === "card" && paymentMethod === "card" && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-emerald-500" />
                          You'll enter your card details securely in the
                          Razorpay payment window.
                        </p>
                      </div>
                    )}
                    {id === "upi" && paymentMethod === "upi" && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-emerald-500" />
                          You'll complete UPI payment securely in the Razorpay
                          window.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {globalError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{globalError}</span>
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <Card className="p-5">
                <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-500" /> Order Summary
                </h2>
                {selectedVendor && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 mb-3">
                    <Store className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-emerald-800 truncate">
                      {selectedVendor.businessName}
                    </span>
                  </div>
                )}
                {effectiveAddress?.street && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                        Delivering to
                      </p>
                      <p className="text-xs text-blue-800 mt-0.5 leading-snug">
                        {effectiveAddress.street}, {effectiveAddress.city}
                        {effectiveAddress.pincode
                          ? ` – ${effectiveAddress.pincode}`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4 pr-0.5">
                  {(cartItems || []).map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                        <img
                          src={
                            item.images?.[0] ||
                            item.image ||
                            "https://via.placeholder.com/40"
                          }
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          × {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-700 flex-shrink-0">
                        ₹{(item.price || 0) * (item.quantity || 0)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal ({(cartItems || []).length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-red-600">₹{total}</span>
                  </div>
                </div>
              </Card>

              <button
                onClick={placeOrder}
                disabled={
                  processing ||
                  !canProceedStep0 ||
                  !canProceedStep1 ||
                  !canProceedStep2
                }
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  processing ||
                  !canProceedStep0 ||
                  !canProceedStep1 ||
                  !canProceedStep2
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-red-200 hover:from-red-600 hover:to-rose-700 hover:shadow-2xl hover:shadow-red-300 hover:-translate-y-0.5"
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {paymentMethod === "cod"
                      ? "Placing Order..."
                      : "Opening Payment..."}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === "cod"
                      ? `Place Order · ₹${total}`
                      : `Pay ₹${total}`}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                {paymentMethod === "cod"
                  ? "Pay safely at your doorstep"
                  : "Secured by Razorpay"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
