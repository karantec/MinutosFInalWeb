import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner, FaRedo, FaShoppingBasket } from "react-icons/fa";
import categoryService from "../service/categoryService";

const CategoriesSub = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulating API call - replace with your actual service call
      const result = await categoryService.getCategoriesWithSubcategories();

      if (result.success) {
        const categoriesData = Array.isArray(result.data)
          ? result.data
          : result.data?.categories || [];
        setCategories(categoriesData);
      } else {
        setError(result.error || "Failed to fetch categories");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Network error occurred");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="my-6 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Shop by Category
        </h2>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <FaSpinner className="animate-spin text-3xl text-red-600 mx-auto mb-3" />
            <span className="text-gray-600">Loading categories...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-6 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Shop by Category
        </h2>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShoppingBasket className="text-red-600 text-xl" />
          </div>
          <p className="text-red-600 font-medium mb-2">Error: {error}</p>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            We're having trouble loading categories. Please check your
            connection and try again.
          </p>
          <button
            className="px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center mx-auto"
            onClick={fetchCategories}
          >
            <FaRedo className="mr-2" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="my-6 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Shop by Category
        </h2>
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShoppingBasket className="text-gray-500 text-xl" />
          </div>
          <p className="text-gray-500 font-medium mb-2">
            No categories available
          </p>
          <p className="text-sm text-gray-600 mb-6">
            There are no categories to display at the moment.
          </p>
          <button
            className="px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            onClick={fetchCategories}
          >
            Refresh
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-6 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Shop by Category
      </h2>

      {categories.map((category) => {
        if (!category.subcategories || category.subcategories.length === 0) {
          return null;
        }

        return (
          <div
            key={category._id}
            className="mb-10 bg-white p-5 rounded-xl shadow-sm"
          >
            {/* Category Header */}
            <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-full mr-3"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/products/${encodeURIComponent(sub.name)}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-red-100 group-hover:shadow-md transition-all duration-200">
                    {sub.image ? (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span
                      className={`text-lg font-bold text-red-600 ${
                        sub.image ? "hidden" : ""
                      }`}
                    >
                      {sub.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium mt-3 text-center line-clamp-2 group-hover:text-red-600 transition-colors">
                    {sub.name || "Unnamed Subcategory"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default CategoriesSub;
