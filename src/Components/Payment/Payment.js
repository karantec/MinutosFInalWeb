import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Lock,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Store,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";

const API_BASE = "http://localhost:8000/api";

// ✅ Fresh axios instance — bypasses any global interceptors/baseURL
const localAxios = axios.create();

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, token } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorError, setVendorError] = useState("");
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    console.log("🟡 Component mounted");
    console.log("🟡 user:", user);
    console.log("🟡 token:", token ? "EXISTS ✅" : "MISSING ❌");
    console.log("🟡 cartItems:", cartItems);
    console.log("🟡 API_BASE:", API_BASE);
    console.log(
      "🟡 window.Razorpay:",
      window.Razorpay ? "LOADED ✅" : "NOT LOADED ❌",
    );
    if (!user) {
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/checkout");
      return;
    }
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setVendorLoading(true);
      setVendorError("");
      console.log("🟡 Fetching vendors from:", `${API_BASE}/vendor`);
      const res = await localAxios.get(`${API_BASE}/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🟡 Vendors response:", res.data);
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : raw?.vendors || raw?.data || [];
      setVendors(list);
    } catch (err) {
      console.error(
        "❌ Failed to fetch vendors:",
        err.response?.data || err.message,
      );
      setVendorError("Could not load vendors. Please try again.");
    } finally {
      setVendorLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0,
  );
  const total = subtotal;

  const validate = () => {
    if (!selectedVendor) {
      setOrderError("Please select a vendor to deliver your order.");
      return false;
    }
    if (!paymentMethod) {
      setOrderError("Please select a payment method.");
      return false;
    }
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.pincode ||
      !shippingAddress.phone
    ) {
      setOrderError("Please fill in all delivery address fields.");
      return false;
    }
    return true;
  };

  const openRazorpay = async (createdOrder) => {
    console.log("4️⃣ openRazorpay() called — orderId:", createdOrder._id);
    console.log(
      "4️⃣ window.Razorpay:",
      window.Razorpay ? "LOADED ✅" : "NOT LOADED ❌",
    );
    try {
      console.log("5️⃣ Calling:", `${API_BASE}/payment/create-order`);
      const rzpRes = await localAxios.post(
        `${API_BASE}/payment/create-order`,
        { orderId: createdOrder._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("6️⃣ payment/create-order response:", rzpRes.data);

      const { razorpayOrderId, amount, currency, key } = rzpRes.data;
      console.log(
        "7️⃣ key:",
        key,
        "| amount:",
        amount,
        "| razorpayOrderId:",
        razorpayOrderId,
      );

      if (!key) {
        console.error("❌ key is MISSING from backend response!");
        setOrderError("Payment config error: key missing from server.");
        setIsProcessing(false);
        return;
      }

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
          contact: shippingAddress.phone || user?.phone || "",
        },
        method: paymentMethod === "upi" ? { upi: true } : { card: true },
        theme: { color: "#dc2626" },
        handler: async (response) => {
          console.log("8️⃣ Payment success:", response);
          try {
            const verifyRes = await localAxios.post(
              `${API_BASE}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            console.log("9️⃣ Verify response:", verifyRes.data);
            if (verifyRes.data?.success) {
              setPlacedOrder(verifyRes.data.order || createdOrder);
              setOrderComplete(true);
            } else {
              setOrderError(
                "Payment verification failed. Please contact support.",
              );
            }
          } catch (err) {
            console.error(
              "❌ Verification error:",
              err.response?.data || err.message,
            );
            setOrderError(
              "Payment done but verification failed. Please contact support.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            console.log("⚠️ Razorpay modal dismissed");
            setOrderError(
              "Payment was cancelled. You can retry from My Orders.",
            );
            setIsProcessing(false);
          },
        },
      };

      console.log("🔟 Creating Razorpay instance...");
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("❌ Payment failed:", response.error);
        setOrderError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      console.log("🔟 Calling rzp.open()...");
      rzp.open();
      console.log("✅ rzp.open() called!");
    } catch (err) {
      console.error(
        "❌ openRazorpay error:",
        err.response?.data || err.message,
      );
      setOrderError(
        err.response?.data?.message || "Could not open payment. Please retry.",
      );
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    console.log("1️⃣ handlePlaceOrder fired");
    console.log("1️⃣ paymentMethod:", paymentMethod);
    console.log("1️⃣ selectedVendor:", selectedVendor?._id);
    console.log("1️⃣ cartItems:", cartItems);
    setOrderError("");
    if (!validate()) {
      console.log("❌ Validation failed");
      return;
    }

    const items = cartItems.map((item) => {
      const productId = item.productId || item.product?._id || item._id;
      console.log("2️⃣ item:", item.name, "→ productId:", productId);
      return { product: productId, quantity: item.quantity };
    });

    const payload = {
      vendorId: selectedVendor._id,
      items,
      shippingAddress,
      paymentMethod,
    };
    console.log("3️⃣ Payload:", payload);
    console.log("3️⃣ Posting to:", `${API_BASE}/order/create`);

    setIsProcessing(true);
    try {
      const res = await localAxios.post(`${API_BASE}/order/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("3️⃣ Order response:", res.data);

      if (!res.data?.success) {
        console.error("❌ Order failed:", res.data);
        setOrderError(res.data?.message || "Order creation failed.");
        setIsProcessing(false);
        return;
      }

      const createdOrder = res.data.order;
      console.log("3️⃣ Order created successfully:", createdOrder._id);

      if (paymentMethod === "cod") {
        console.log("✅ COD — going to success");
        setPlacedOrder(createdOrder);
        setOrderComplete(true);
        setIsProcessing(false);
        return;
      }

      console.log("3️⃣ Calling openRazorpay...");
      await openRazorpay(createdOrder);
    } catch (err) {
      console.error(
        "❌ handlePlaceOrder error:",
        err.response?.data || err.message,
      );
      setOrderError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  if (orderComplete && placedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully with{" "}
            <span className="font-semibold text-gray-800">
              {selectedVendor?.businessName}
            </span>
            . We'll deliver it in 18 minutes!
          </p>
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-xl font-bold text-red-600">
              #{placedOrder._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{placedOrder.totalAmount || total}
            </p>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              via{" "}
              {paymentMethod === "cod"
                ? "Cash on Delivery"
                : paymentMethod === "upi"
                  ? "UPI"
                  : "Card"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex-1 border-2 border-red-600 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-red-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Complete Your Order
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Fill in details & select a vendor
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-red-600" /> Select Vendor
              </h2>
              {vendorLoading ? (
                <div className="flex items-center gap-3 text-gray-500 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading
                  vendors...
                </div>
              ) : vendorError ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm">{vendorError}</span>
                  <button
                    onClick={fetchVendors}
                    className="text-xs underline ml-2 hover:text-red-900"
                  >
                    Retry
                  </button>
                </div>
              ) : vendors.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No vendors available right now.
                </p>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setVendorDropdownOpen((o) => !o)}
                    className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-colors ${selectedVendor ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
                  >
                    {selectedVendor ? (
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                          <Store className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {selectedVendor.businessName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {[selectedVendor.city, selectedVendor.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Choose a vendor...</span>
                    )}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${vendorDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {vendorDropdownOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                      {vendors.map((v) => (
                        <button
                          key={v._id}
                          onClick={() => {
                            setSelectedVendor(v);
                            setVendorDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left ${selectedVendor?._id === v._id ? "bg-red-50" : ""}`}
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Store className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {v.businessName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {[v.area, v.city, v.state]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                          {selectedVendor?._id === v._id && (
                            <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street / House / Flat *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12A, Park Street"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        street: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Patna"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bihar"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 800001"
                    value={shippingAddress.pincode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        pincode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-red-600" /> Payment Method
              </h2>
              <div className="space-y-4">
                {/* Card */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === "card" ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${paymentMethod === "card" ? "bg-red-600" : "bg-gray-100"}`}
                      >
                        <CreditCard
                          className={`w-6 h-6 ${paymentMethod === "card" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Credit / Debit Card
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pay securely via Razorpay
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {paymentMethod === "card" && (
                    <div className="pt-3 border-t mt-3">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-500" /> You'll enter
                        card details securely in the Razorpay payment window.
                      </p>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${paymentMethod === "upi" ? "bg-red-600" : "bg-gray-100"}`}
                      >
                        <Wallet
                          className={`w-6 h-6 ${paymentMethod === "upi" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">UPI Payment</h3>
                        <p className="text-sm text-gray-500">
                          Google Pay, PhonePe, Paytm & more
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="pt-3 border-t mt-3">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-500" /> You'll
                        complete UPI payment in the Razorpay window.
                      </p>
                    </div>
                  )}
                </div>

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-red-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${paymentMethod === "cod" ? "bg-red-600" : "bg-gray-100"}`}
                      >
                        <Banknote
                          className={`w-6 h-6 ${paymentMethod === "cod" ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Cash on Delivery
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {orderError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                ⚠️ {orderError}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              {selectedVendor && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-800 font-medium truncate">
                    {selectedVendor.businessName}
                  </span>
                </div>
              )}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        "https://via.placeholder.com/48"
                      }
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-contain border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                      ₹{(item.price || 0) * (item.quantity || 0)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-red-600">₹{total}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentMethod === "cod"
                      ? "Placing Order..."
                      : "Opening Payment..."}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {paymentMethod === "cod"
                      ? `Place Order · ₹${total}`
                      : `Pay ₹${total}`}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
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
