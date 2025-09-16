import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import categoryService from "../service/categoryService";

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
    <section className="my-4 px-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Shop by Category
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/subCategory/${encodeURIComponent(category.name)}`}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:shadow-md transition">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="text-lg font-bold text-red-600">
                  {category.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-700 font-medium mt-2 text-center line-clamp-2">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesList;
