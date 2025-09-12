import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import subcategoryService from "../service/subcategoryService";

const FruitsVegetablesComponent = () => {
  const { categoryName } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "All",
    name: "All",
  });

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const result = await subcategoryService.getSubCategories(categoryName);
        if (result.success) {
          setSubCategories([{ _id: "All", name: "All" }, ...result.data]);
        } else {
          setSubCategories([{ _id: "All", name: "All" }]);
        }
        setSelectedCategory({ _id: "All", name: "All" });
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([{ _id: "All", name: "All" }]);
        setSelectedCategory({ _id: "All", name: "All" });
      }
    };
    fetchSubCategories();
  }, [categoryName]);

  // Dummy products (replace with API later)
  const products = [
    {
      id: 1,
      name: "Coriander leaves",
      price: 12,
      originalPrice: 13,
      savings: 1,
      weight: "1 pack (100 g)",
      rating: 4.5,
      reviews: "686.4k",
      category: "Fresh Vegetables",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Banana Robusta",
      price: 35,
      originalPrice: 40,
      savings: 5,
      weight: "4 pcs",
      rating: 4.5,
      reviews: "81.7k",
      category: "Fresh Fruits",
      image: "https://via.placeholder.com/150",
    },
  ];

  const filteredProducts =
    selectedCategory._id === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory.name);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <span className="font-bold text-lg text-gray-900">
            ₹{product.price}
          </span>
          <button className="bg-white border border-pink-500 text-pink-500 px-3 py-1 rounded-md text-xs font-bold hover:bg-pink-50 transition-colors">
            ADD
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="line-through">₹{product.originalPrice}</span>
          <span className="text-green-600 font-bold">
            SAVE ₹{product.savings}
          </span>
        </div>
        <div className="text-xs text-gray-600">{product.weight}</div>
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-700">
            {product.rating}
          </span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span>›</span>
          <span>{categoryName}</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            {selectedCategory?.name || "All"}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Fresh {categoryName}
        </h1>

        <div className="flex gap-6">
          {/* Sidebar (Desktop) */}
          {/* <div className="hidden lg:block w-64 space-y-2">
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setSelectedCategory(sub)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  selectedCategory._id === sub._id
                    ? "bg-purple-50 text-purple-700 font-semibold border-2 border-purple-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <span className="text-sm">{sub.name}</span>
              </button>
            ))}
          </div> */}

          {/* Main Content */}

          <div className="flex gap-6">
            {/* Sidebar - Now shows vertically on all screen sizes including mobile */}
            <div className="w-20 sm:w-20 md:w-48 lg:w-64 flex-shrink-0">
              <div className="space-y-4">
                {subCategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedCategory(sub)}
                    className={`w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 rounded-xl text-center sm:text-left transition-all duration-200 ${
                      selectedCategory._id === sub._id
                        ? "bg-purple-50 text-purple-700 font-semibold border-2 border-purple-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div className="w-8 h-8 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {sub.image && (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-tight">
                      {sub.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="h-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitsVegetablesComponent;
