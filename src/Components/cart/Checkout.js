import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
} from "../store/cartSlice";
import { FaPlus, FaMinus, FaTrash, FaSpinner } from "react-icons/fa";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Fetch cart on component mount
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchCartAsync(user.userId));
    } else {
      // Redirect to login if no user
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  // Handle quantity increase
  const handleIncreaseQuantity = async (item) => {
    if (!user?.userId) return;

    const itemId = item.productId || item._id;
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await dispatch(
        updateCartItemAsync({
          userId: user.userId,
          productId: itemId,
          quantity: item.quantity + 1,
        })
      ).unwrap();

      dispatch(fetchCartAsync(user.userId));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = async (item) => {
    if (!user?.userId) return;

    const itemId = item.productId || item._id;

    if (item.quantity <= 1) {
      handleRemoveItem(item);
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await dispatch(
        updateCartItemAsync({
          userId: user.userId,
          productId: itemId,
          quantity: item.quantity - 1,
        })
      ).unwrap();

      dispatch(fetchCartAsync(user.userId));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (item) => {
    if (!user?.userId) return;

    const itemId = item.productId || item._id;
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await dispatch(
        removeFromCartAsync({
          userId: user.userId,
          productId: itemId,
        })
      ).unwrap();

      dispatch(fetchCartAsync(user.userId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Loading state
  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin w-8 h-8 text-red-600 mr-3" />
          <span className="text-lg">Loading your cart...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchCartAsync(user?.userId))}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Add some delicious items to continue checkout.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

      {/* Delivery Info */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6 shadow-sm">
        <h2 className="font-semibold text-lg text-green-700">
          🚚 Fast Delivery in 15 Minutes
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Enjoy quick delivery right to your doorstep!
        </p>
      </div>

      {/* Cart Items */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Your Items ({cartItems.length})
        </h2>
        <ul className="divide-y">
          {cartItems.map((item) => {
            const itemId = item.productId || item._id;
            const isUpdating = updatingItems.has(itemId);

            return (
              <li
                key={item._id}
                className="flex justify-between items-center py-4"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={
                      item.images?.[0] ||
                      item.image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.unit}</p>
                    <p className="text-gray-600 text-sm">₹{item.price} each</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleDecreaseQuantity(item)}
                      disabled={isUpdating}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {item.quantity <= 1 ? (
                        <FaTrash className="w-3 h-3 text-red-500" />
                      ) : (
                        <FaMinus className="w-3 h-3 text-gray-600" />
                      )}
                    </button>

                    <div className="px-4 py-2 text-sm font-medium min-w-[50px] text-center">
                      {isUpdating ? (
                        <FaSpinner className="w-3 h-3 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </div>

                    <button
                      onClick={() => handleIncreaseQuantity(item)}
                      disabled={isUpdating}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus className="w-3 h-3 text-green-600" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-gray-800">
                      ₹{(item.price || 0) * (item.quantity || 0)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      disabled={isUpdating}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Order Summary
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Tax & Service Charges</span>
            <span>Included</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")}
          className="sm:w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/payment")}
          disabled={loading || cartItems.length === 0}
          className="sm:w-2/3 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : `Proceed to Payment (₹${total})`}
        </button>
      </div>
    </div>
  );
}
