import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Star,
  Home,
  Download,
  Share2,
  Mail,
} from "lucide-react";

export default function ThankYouPage() {
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  const orderDetails = {
    orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    estimatedDelivery: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    items: [
      { name: "Premium Wireless Headphones", qty: 1, price: 129.99 },
      { name: "Smart Watch Series 5", qty: 1, price: 299.99 },
    ],
    total: 429.98,
    paymentMethod: "Credit Card",
    deliveryAddress: "123 Main Street, Downtown, City 12345",
  };

  const trackingSteps = [
    {
      icon: CheckCircle,
      label: "Order Placed",
      status: "completed",
      time: "Just now",
    },
    {
      icon: Package,
      label: "Processing",
      status: "current",
      time: "Within 2 hours",
    },
    {
      icon: Truck,
      label: "Shipped",
      status: "pending",
      time: "Within 24 hours",
    },
    {
      icon: MapPin,
      label: "Delivered",
      status: "pending",
      time: orderDetails.estimatedDelivery,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#ef4444",
                    "#f97316",
                    "#fbbf24",
                    "#34d399",
                    "#60a5fa",
                  ][Math.floor(Math.random() * 5)],
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500"></div>

            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Thank You for Your Order! 🎉
              </h1>

              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                We're excited to get your order to you! Your purchase has been
                confirmed and we'll send you updates every step of the way.
              </p>

              <div className="inline-flex items-center gap-3 bg-red-50 px-6 py-4 rounded-2xl border-2 border-red-200">
                <Package className="w-6 h-6 text-red-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-2xl font-bold text-red-600">
                    {orderDetails.orderNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Truck className="w-7 h-7 text-red-600" />
              Order Tracking
            </h2>

            <div className="space-y-6">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Connection Line */}
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`absolute left-6 top-12 w-0.5 h-16 ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "current"
                          ? "bg-red-600 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-bold text-lg ${
                            step.status === "completed" ||
                            step.status === "current"
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </h3>
                        {step.status === "completed" && (
                          <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                        {step.status === "current" && (
                          <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          step.status === "completed" ||
                          step.status === "current"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <p className="font-semibold text-gray-800">
                  Estimated Delivery
                </p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {orderDetails.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Details
            </h2>

            <div className="space-y-6">
              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  Items Ordered
                </h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 rounded-xl p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.qty}
                        </p>
                      </div>
                      <p className="font-bold text-red-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200 mt-4">
                  <p className="text-lg font-bold text-gray-800">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    ${orderDetails.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">
                    {orderDetails.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {orderDetails.date}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Order Time</p>
                  <p className="font-semibold text-gray-800">
                    {orderDetails.time}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-800">
                    {orderDetails.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-4 rounded-2xl hover:bg-red-50 transition-all shadow-lg hover:shadow-xl border-2 border-red-200">
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-4 rounded-2xl hover:bg-red-50 transition-all shadow-lg hover:shadow-xl border-2 border-red-200">
              <Mail className="w-5 h-5" />
              Email Receipt
            </button>
            <button className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl shadow-xl p-8 text-white text-center">
            <Star className="w-12 h-12 mx-auto mb-4 fill-yellow-300 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-3">
              We Hope You Love Your Purchase!
            </h2>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Need help with your order? Our support team is here 24/7 to assist
              you.
            </p>
            <button className="bg-white text-red-600 font-semibold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
