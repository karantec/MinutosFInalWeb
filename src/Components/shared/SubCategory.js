import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

const FruitsVegetablesComponent = () => {
  const categoryName = "Fruits Vegetables"; // Mock category name
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "All",
    name: "All",
  });

  useEffect(() => {
    // Mock subcategory data similar to Zepto
    const mockSubCategories = [
      { _id: "All", name: "All", image: "🛒" },
      { _id: "1", name: "Fresh Vegetables", image: "🥕" },
      { _id: "2", name: "New Launches", image: "🆕" },
      { _id: "3", name: "Fresh Fruits", image: "🍎" },
      { _id: "4", name: "Exotics & Premium", image: "🥑" },
      { _id: "5", name: "Flowers & Leaves", image: "🌸" },
    ];

    setSubCategories(mockSubCategories);
    setSelectedCategory({ _id: "All", name: "All" });
  }, [categoryName]);

  // Mock products data
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
      image:
        "https://images.unsplash.com/photo-1556909114-b3b0c5a89c6b?w=200&h=200&fit=crop&crop=center",
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
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Fresh Onion",
      price: 41,
      originalPrice: 45,
      savings: 4,
      weight: "1 Pack / 900 -1000 gm",
      rating: 4.3,
      reviews: "234.2k",
      category: "Fresh Vegetables",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "Mushroom Button",
      price: 68,
      originalPrice: 77,
      savings: 9,
      weight: "200 g",
      rating: 4.2,
      reviews: "156.8k",
      category: "Fresh Vegetables",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 5,
      name: "Green Chili",
      price: 25,
      originalPrice: 28,
      savings: 3,
      weight: "100 g",
      rating: 4.4,
      reviews: "89.3k",
      category: "Fresh Vegetables",
      image:
        "https://images.unsplash.com/photo-1583846499390-b7b37d6e8646?w=200&h=200&fit=crop&crop=center",
    },
    {
      id: 6,
      name: "Cherry Tomato",
      price: 89,
      originalPrice: 95,
      savings: 6,
      weight: "200 g",
      rating: 4.6,
      reviews: "45.7k",
      category: "Fresh Vegetables",
      image:
        "https://images.unsplash.com/photo-1546470427-e856b2967167?w=200&h=200&fit=crop&crop=center",
    },
  ];

  const filteredProducts =
    selectedCategory._id === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory.name);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 hover:shadow-md transition-all duration-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl mb-2"
      />
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <span className="font-bold text-sm sm:text-lg text-gray-900">
            ₹{product.price}
          </span>
          <button className="bg-white border border-pink-500 text-pink-500 px-2 sm:px-3 py-1 rounded-md text-xs font-bold hover:bg-pink-50 transition-colors">
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
        <h3 className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-2">
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
          {/* Sidebar - Now shows vertically on all screen sizes including mobile */}
          <div className="w-20 sm:w-20 md:w-48 lg:w-64 flex-shrink-0">
            <div className="space-y-2">
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
                  <div className="w-8 h-8 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {sub.image}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-tight">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitsVegetablesComponent;
