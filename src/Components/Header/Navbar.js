import React, { useState, useEffect } from "react";
import {
  FaRegUser,
  FaShoppingCart,
  FaSearch,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { locationService } from "../service/locationService";
import { categoryService } from "../service/categoryService";
const Header = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    "Detecting location..."
  );
  const [locationLoading, setLocationLoading] = useState(true);

  // Default category icons mapping based on category names
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "Fruits & Vegetables": "🥦",
      "Atta, Rice, Oil & Dals": "🌾",
      "Masala & Dry Fruits": "🌶️",
      "Cold Drinks & Juices": "🥤",
      "Biscuits & Cookies": "🍪",
      "Tea, Coffee & More": "☕",
      "Meat, Fish & Eggs": "🥩",
      Electronics: "🎧",
      Beauty: "🧴",
      Fashion: "👕",
      Toys: "🧸",
      Home: "🏠",
      Mobiles: "📱",
      All: "🛍️",
    };
    return iconMap[categoryName] || "📦";
  };

  // Auto-detect location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        console.log("Auto-detecting location...");
        const result = await locationService.getUserLocationWithAddress();
        console.log("Location detection result:", result);

        if (result.success && result.location) {
          let locationString = "";

          if (result.location.address) {
            locationString =
              result.location.address.formatted ||
              result.location.address.full ||
              "Current Location";
          } else {
            locationString = "Current Location";
          }

          console.log("Auto-detected location:", locationString);
          setSelectedLocation(locationString);

          // Save to storage
          locationService.saveLocationToStorage(locationString);
        } else {
          console.error("Location detection failed:", result);
          setSelectedLocation("Location not available");
        }
      } catch (error) {
        console.error("Error auto-detecting location:", error);
        setSelectedLocation("Location not available");
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const result = await categoryService.getCategories();

        if (result.success) {
          // Add "All" category at the beginning
          const allCategories = [{ _id: "all", name: "All" }, ...result.data];
          setCategories(allCategories);
        } else {
          setCategoriesError(result.error || "Failed to fetch categories");
          // Fallback to default categories if API fails
          setCategories([
            { _id: "all", name: "All" },
            { _id: "electronics", name: "Electronics" },
            { _id: "beauty", name: "Beauty" },
            { _id: "fashion", name: "Fashion" },
            { _id: "home", name: "Home" },
          ]);
        }
      } catch (error) {
        console.error("Error in fetchCategories:", error);
        setCategoriesError("Network error occurred");
        // Fallback to default categories
        setCategories([
          { _id: "all", name: "All" },
          { _id: "electronics", name: "Electronics" },
          { _id: "beauty", name: "Beauty" },
          { _id: "fashion", name: "Fashion" },
          { _id: "home", name: "Home" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
  };

  // Sample cart items
  const cartItems = [
    { id: 1, name: "Product 1", price: 299, quantity: 2 },
    { id: 2, name: "Product 2", price: 499, quantity: 1 },
  ];

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Your Cart ({cartItems.length})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm mt-2">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md mr-3"></div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Top Banner - Hidden on mobile like in the image */}
      <div className="hidden sm:block bg-red-700 text-white text-center py-1.5 px-2">
        <p className="text-xs sm:text-sm">
          Get Cigarettes at <span className="font-bold">₹0</span> Convenience
          Fee
          <span className="hidden sm:inline">
            {" "}
            • Get smoking accessories, fresheners & more in minutes!
          </span>
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section - Logo */}
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center">
                <Link to="/">
                  <span className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight">
                    minutos
                  </span>
                </Link>
              </div>

              {/* Express Delivery Badge - Desktop only */}
              <div className="hidden sm:block">
                <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
                  EXPRESS DELIVERY
                </span>
              </div>
            </div>

            {/* Center Section - Location & Search (Desktop) */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
              {/* Location Display */}
              <div className="min-w-fit">
                <div className="flex items-center space-x-2 text-gray-700 px-3 py-2">
                  <span className="text-sm font-medium whitespace-nowrap max-w-[160px] truncate">
                    {locationLoading ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                        Detecting...
                      </span>
                    ) : (
                      selectedLocation
                    )}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder='Search for "cheese slices"'
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              {/* Location on Mobile */}
              <div className="md:hidden flex items-center text-gray-700 px-2 py-1 text-sm">
                <span className="font-medium max-w-[180px] sm:max-w-[240px] truncate">
                  {locationLoading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                      Detecting...
                    </span>
                  ) : (
                    selectedLocation
                  )}
                </span>
              </div>

              {/* COD Badge */}
              <div className="hidden lg:block">
                <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded text-xs font-semibold">
                  COD
                </span>
              </div>

              {/* Cart Icon - Desktop */}
              <button
                className="hidden md:flex items-center p-2 text-gray-700 transition-colors hover:text-red-600 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2 text-gray-700 transition-colors hover:text-red-600"
              >
                <FaRegUser className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-3 sm:px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder='Search for "cheese slices"'
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none text-sm transition-all"
            />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="px-3 sm:px-4 lg:px-6">
          {/* Error message */}
          {categoriesError && !categoriesLoading && (
            <div className="text-center py-2">
              <p className="text-sm text-red-600">
                Failed to load categories. Using default categories.
              </p>
            </div>
          )}

          {/* Desktop Categories */}
          <div className="hidden md:flex justify-center items-center gap-6 h-12 overflow-x-auto scrollbar-hide">
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <FaSpinner className="animate-spin w-4 h-4" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category._id}
                  className={`flex items-center gap-2 whitespace-nowrap pb-2 transition-colors ${
                    activeCategory === category.name
                      ? "text-red-600 font-medium border-b-2 border-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      activeCategory === category.name
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <span className="text-xs">
                      {getCategoryIcon(category.name)}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))
            )}
          </div>

          {/* Mobile Categories - Horizontal Scroll with Icons Only */}
          <div className="md:hidden flex items-center gap-4 h-16 overflow-x-auto scrollbar-hide px-1">
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-gray-500 px-4">
                <FaSpinner className="animate-spin w-4 h-4" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category._id}
                  className={`flex flex-col items-center gap-1 min-w-fit px-2 py-1 transition-colors ${
                    activeCategory === category.name
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <div className="text-2xl">
                    {getCategoryIcon(category.name)}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap max-w-[60px] truncate">
                    {category.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          <button className="flex flex-col items-center justify-center text-red-600 px-3 py-2">
            <div className="text-xl mb-1">M</div>
            <span className="text-xs font-medium">Minutos</span>
          </button>

          <button className="flex flex-col items-center justify-center text-gray-600 px-3 py-2">
            <div className="text-lg mb-1">☰</div>
            <span className="text-xs font-medium">Categories</span>
          </button>

          <button className="flex flex-col items-center justify-center text-gray-600 px-3 py-2">
            <div className="text-lg mb-1">%</div>
            <span className="text-xs font-medium">Deal Store</span>
          </button>

          <button
            className="flex flex-col items-center justify-center text-gray-600 px-3 py-2 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="text-lg mb-1">🛒</div>
            <span className="text-xs font-medium">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
