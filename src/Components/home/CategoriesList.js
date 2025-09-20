import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import categoryService from "../service/categoryService";
import ProductCard from "./ProductCard";
import ProductCard3 from "./ProductCard3";
import ChocolatePage from "./ChoclatePage";
// import Mithai from "./Mithai";
import ProductCard4 from "./Mithai";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await categoryService.getCategories();

        if (result.success) {
          setCategories(result.data);
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

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="my-4 px-4">
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-2xl text-red-600 mr-2" />
          <span>Loading categories...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-4 px-4">
        <div className="text-center py-8 text-red-600">
          <p>Error: {error}</p>
          <p className="text-sm text-gray-600 mt-2">
            Please check your connection and try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-4 px-4 max-w-7xl mx-auto">
      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="group rounded-lg p-3 transition-shadow cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-red-100 group-hover:shadow-md transition-all duration-200">
              <Link
                to={`/subCategory/${encodeURIComponent(category.name)}`}
                className="w-full h-full flex items-center justify-center"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-200"
                    alt={category.name}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="text-2xl text-gray-700 font-bold group-hover:text-red-600 transition-colors flex items-center justify-center">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            </div>

            <div className="text-center mt-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-800 leading-tight px-1 line-clamp-2">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Components Section */}
      <div className="mt-10 space-y-8">
        <ProductCard />
        <ProductCard3 />
        <ChocolatePage />
        <ProductCard4 />
      </div>
    </section>
  );
};

export default CategoriesList;
