import React, { useState, useEffect } from "react";
import {
  FaRegUser,
  FaShoppingCart,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { locationService } from "../service/locationService";
import { categoryService } from "../service/categoryService";

const Header = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    "Detecting location..."
  );
  const [locationLoading, setLocationLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Apartment 4B, New York, NY 10001",
      type: "home",
    },
    {
      id: 2,
      name: "Work",
      address: "456 Office Park, Building C, New York, NY 10002",
      type: "work",
    },
  ]);

  // Default category icons mapping
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

  // Auto-detect location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const result = await locationService.getUserLocationWithAddress();
        if (result.success && result.location) {
          let locationString =
            result.location.address?.formatted ||
            result.location.address?.full ||
            "Current Location";

          setSelectedLocation(locationString);
          locationService.saveLocationToStorage(locationString);
        } else {
          setSelectedLocation("Location not available");
        }
      } catch {
        setSelectedLocation("Location not available");
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const result = await categoryService.getCategories();

        if (result.success) {
          const allCategories = [{ _id: "all", name: "All" }, ...result.data];
          setCategories(allCategories);
        } else {
          setCategoriesError(result.error || "Failed to fetch categories");
          setCategories([
            { _id: "all", name: "All" },
            { _id: "electronics", name: "Electronics" },
            { _id: "beauty", name: "Beauty" },
            { _id: "fashion", name: "Fashion" },
            { _id: "home", name: "Home" },
          ]);
        }
      } catch {
        setCategoriesError("Network error occurred");
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
    <>
      {/* Top Banner */}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-0">
            {/* Logo */}
            <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-6">
              <Link to="/">
                <span className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight">
                  minutos
                </span>
              </Link>
              <div className="hidden sm:block">
                <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase">
                  EXPRESS DELIVERY
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="mt-2 sm:mt-0 flex-1 sm:max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder='Search for "cheese slices"'
                  className="w-full pl-12 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Cart + Profile */}
            <div className="flex items-center justify-end space-x-3 mt-2 sm:mt-0">
              <button
                className="flex items-center p-2 text-gray-700 hover:text-red-600 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <Link
                to="/profile"
                className="p-2 text-gray-700 hover:text-red-600"
              >
                <FaRegUser className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <nav className="bg-white border-t border-gray-100">
          <div className="px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-start sm:justify-center h-12 overflow-x-auto scrollbar-hide gap-4">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaSpinner className="animate-spin w-4 h-4" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category._id}
                    className={`flex-shrink-0 flex items-center gap-1 whitespace-nowrap pb-2 min-w-fit ${
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
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Location Popup */}
      {isLocationPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Location</h2>
              <button
                onClick={() => setIsLocationPopupOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for area, street name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Saved Addresses
                </h3>
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start p-3 border rounded-lg cursor-pointer hover:border-red-500"
                      onClick={() => {
                        setSelectedLocation(address.address);
                        setIsLocationPopupOpen(false);
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            address.type === "home"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {address.type === "home" ? "🏠" : "💼"}
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{address.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t">
                <h3 className="font-medium text-gray-700 mb-3">
                  Detect Current Location
                </h3>
                <button
                  className="w-full flex items-center p-3 border rounded-lg hover:border-red-500"
                  onClick={async () => {
                    setLocationLoading(true);
                    setIsLocationPopupOpen(false);
                    try {
                      const result =
                        await locationService.getUserLocationWithAddress();
                      if (result.success && result.location) {
                        let locationString =
                          result.location.address?.formatted ||
                          result.location.address?.full ||
                          "Current Location";
                        setSelectedLocation(locationString);
                        locationService.saveLocationToStorage(locationString);
                      } else {
                        setSelectedLocation("Location not available");
                      }
                    } catch {
                      setSelectedLocation("Location not available");
                    } finally {
                      setLocationLoading(false);
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-red-600" />
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <h4 className="font-medium">Use current location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Enabled location permission required
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4 border-t">
              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Add New Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
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

      {/* Overlay */}
      {(isCartOpen || isLocationPopupOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsCartOpen(false);
            setIsLocationPopupOpen(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Header;
