import React, { useState, useEffect } from "react";
import {
  FaRegUser,
  FaShoppingCart,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaMapMarkerAlt,
  FaChevronDown,
  FaHome,
  FaList,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { locationService } from "../service/locationService";
import { categoryService } from "../service/categoryService";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationPopup, setIsLocationPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(
    "Mumbai Central, Mumbai, Maharashtra"
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        }
      } catch (error) {
        console.log("Location detection failed");
      }
    };

    // Uncomment to enable auto-detection
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
          // Don't add "All" category for desktop navigation
          setCategories(result.data);
        } else {
          setCategoriesError(result.error || "Failed to fetch categories");
        }
      } catch {
        setCategoriesError("Network error occurred");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Sample cart items
  const cartItems = [{ id: 1, name: "Curd", price: 31, quantity: 1 }];
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

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* Location Popup */}
      {isLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              onClick={() => setIsLocationPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Choose your location
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Detect your location or enter manually:
            </p>
            <button
              onClick={() => {
                setLocationLoading(true);
                setIsLocationPopup(false);
              }}
              className="w-full bg-red-600 text-white py-2 rounded-md mb-3 hover:bg-red-700"
            >
              Detect Current Location
            </button>
            <input
              type="text"
              placeholder="Enter area, street name..."
              className="w-full border px-3 py-2 rounded-md text-sm"
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white">
        {/* Desktop Layout */}
        {!isMobileView && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Left - Logo and Location */}
              <div className="flex items-center gap-6">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                  <div className="text-2xl text-red-400">Minutos</div>
                </Link>

                {/* Location */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsLocationPopup(true)}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-black">
                      Delivery in 17 minutes
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      {locationLoading ? (
                        <span className="flex items-center">
                          <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                          Detecting...
                        </span>
                      ) : (
                        <>
                          <span className="truncate max-w-[300px]">
                            {selectedLocation}
                          </span>
                          <FaChevronDown className="ml-1 w-3 h-3" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder='Search "egg"'
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Right - Login and Cart */}
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-lg font-medium text-gray-800 hover:text-green-600"
                >
                  Login
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span className="font-medium">{cartItems.length} items</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobileView && (
          <div className="px-4">
            {/* Top Row - Location and User Icon */}
            <div className="flex items-center justify-between py-3">
              {/* Left - Location */}
              <div
                className="flex items-center cursor-pointer flex-1"
                onClick={() => setIsLocationPopup(true)}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-black">
                    Delivery in 17 minutes
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    {locationLoading ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                        Detecting...
                      </span>
                    ) : (
                      <>
                        <span className="truncate max-w-[200px]">
                          {selectedLocation}
                        </span>
                        <FaChevronDown className="ml-1 w-3 h-3" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right - User Icon */}
              <Link
                to="/login"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaRegUser className="w-5 h-5 text-gray-700" />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder='Search "egg"'
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Category Navigation - Desktop Only */}
      {!isMobileView && (
        <nav className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            {categoriesError && !categoriesLoading && (
              <div className="text-center py-2">
                <p className="text-sm text-red-600">
                  Failed to load categories.
                </p>
              </div>
            )}

            <div className="flex items-center justify-start py-3 overflow-x-auto scrollbar-hide">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaSpinner className="animate-spin w-4 h-4" />
                  <span className="text-sm">Loading categories...</span>
                </div>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category._id}`}
                    className="flex-shrink-0 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 whitespace-nowrap px-4 py-2 mx-1 rounded-md hover:bg-gray-50"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobileView && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex justify-around items-center py-2">
            {/* Home Button */}
            <Link
              to="/"
              className="flex flex-col items-center justify-center text-gray-700"
            >
              <FaHome className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            {/* Categories Button */}
            <Link
              to="/subcategory"
              className="flex flex-col items-center justify-center text-gray-700"
            >
              <button className="flex flex-col items-center justify-center text-gray-700">
                <FaList className="w-6 h-6" />
                <span className="text-xs mt-1">Categories</span>
              </button>
            </Link>{" "}
            {/* Search Button */}
            <button className="flex flex-col items-center justify-center text-gray-700">
              <FaSearch className="w-6 h-6" />
              <span className="text-xs mt-1">Search</span>
            </button>
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center justify-center text-gray-700 relative"
            >
              <FaShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
