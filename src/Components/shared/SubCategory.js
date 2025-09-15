import React, { useState, useEffect } from "react";
import { Star, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import subcategoryService from "../service/subcategoryService";
import axios from "axios";

const FruitsVegetablesComponent = () => {
  const { categoryName } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "All",
    name: "All",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subcategories
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
        setProducts([]); // reset when category changes
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([{ _id: "All", name: "All" }]);
        setSelectedCategory({ _id: "All", name: "All" });
        setProducts([]);
      }
    };
    fetchSubCategories();
  }, [categoryName]);

  // Fetch products when subcategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // "All" means no filtering
        if (selectedCategory._id === "All") {
          try {
            const allResponse = await axios.get(
              "http://localhost:8000/api/product"
            );
            if (allResponse.data && Array.isArray(allResponse.data.data)) {
              setProducts(allResponse.data.data);
            } else {
              setProducts([]);
            }
          } catch (err) {
            console.error("Error fetching all products:", err);
            setProducts([]);
          } finally {
            setLoading(false);
          }
          return;
        }

        const response = await axios.post(
          "http://localhost:8000/api/product/by-subcategories",
          {
            subCategories: [selectedCategory.name],
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Filter products by search
  const filteredProducts = products.filter(
    (product) =>
      searchQuery === "" ||
      product.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product["Product Name"]
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-200">
      <img
        src={product.Images || "https://via.placeholder.com/150"}
        alt={product["Product Name"] || product.Name}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <span className="font-bold text-lg text-gray-900">
            ₹{product["Discounted MRP"] || "--"}
          </span>
          <button className="bg-white border border-pink-500 text-pink-500 px-3 py-1 rounded-md text-xs font-bold hover:bg-pink-50 transition-colors">
            ADD
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {product.originalPrice && (
            <span className="line-through">₹{product.originalPrice}</span>
          )}
          {product.amountSaving && (
            <span className="text-green-600 font-bold">
              SAVE ₹{product.amountSaving}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600">
          {product.Unit || product.Pack}
        </div>
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
          {product["Product Name"] || product.Name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-700">
            {product.Rating || "--"}
          </span>
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

        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-20 sm:w-20 md:w-48 lg:w-64 flex-shrink-0">
            <div className="space-y-4">
              {subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedCategory(sub)}
                  className={`w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 rounded-xl text-center sm:text-left transition-all duration-200 ${
                    selectedCategory._id === sub._id
                      ? "bg-red-50 text-red-500 font-semibold border-2 border-red-200 shadow-sm"
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
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } found`}
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            {/* Products Grid */}
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="h-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitsVegetablesComponent;
