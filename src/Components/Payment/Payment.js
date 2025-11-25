import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Lock,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";

export default function PaymentCheckout() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "John Doe",
    phone: "+1 234-567-8900",
    email: "john.doe@example.com",
    address: "123 Main St, Downtown Store",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const orderSummary = {
    items: [
      { name: "Product 1", qty: 2, price: 29.99 },
      { name: "Product 2", qty: 1, price: 49.99 },
    ],
    subtotal: 109.97,
    tax: 10.99,
    delivery: 5.0,
    total: 125.96,
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return;
    } else if (name === "expiry") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5) return;
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (
      paymentMethod !== "cod" &&
      (!cardDetails.cardNumber ||
        !cardDetails.cardName ||
        !cardDetails.expiry ||
        !cardDetails.cvv)
    ) {
      alert("Please fill in all card details");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  if (orderComplete) {
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
            Your order has been successfully placed and will be delivered soon.
          </p>
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-red-600">
              #ORD-{Math.floor(Math.random() * 100000)}
            </p>
          </div>
          <button
            onClick={() => setOrderComplete(false)}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-red-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Complete Your Order
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Choose your payment method
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Delivery Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{deliveryInfo.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{deliveryInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{deliveryInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{deliveryInfo.address}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-red-600" />
                Select Payment Method
              </h2>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          paymentMethod === "card"
                            ? "bg-red-600"
                            : "bg-gray-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-6 h-6 ${
                            paymentMethod === "card"
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Credit / Debit Card
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pay securely with your card
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
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Payment */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          paymentMethod === "upi" ? "bg-red-600" : "bg-gray-100"
                        }`}
                      >
                        <Wallet
                          className={`w-6 h-6 ${
                            paymentMethod === "upi"
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">UPI Payment</h3>
                        <p className="text-sm text-gray-500">
                          Pay via Google Pay, PhonePe, Paytm
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          paymentMethod === "cod" ? "bg-red-600" : "bg-gray-100"
                        }`}
                      >
                        <Banknote
                          className={`w-6 h-6 ${
                            paymentMethod === "cod"
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Cash on Delivery
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pay when you receive
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
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ${orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-800">
                    ${orderSummary.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-gray-800">
                    ${orderSummary.delivery.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-red-600">
                    ${orderSummary.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure checkout powered by encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
