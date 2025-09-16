// src/components/SubCategoryProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard3 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://backend.minutos.shop/api/product/subcategories?subCategories=68c90e2b44c6da7aa09c5300"
        );
        setProducts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log("Added to cart:", product);
    // ✅ Add Redux/Context/LocalStorage cart logic here
  };

  if (loading) {
    return <p className="text-center py-6">Loading products...</p>;
  }

  return (
    <section className="px-4 py-6 bg-gray-50">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-black">
          Morning and Breakfast Dairy
        </h2>
      </div>

      {/* Match previous card design */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 pb-2">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleCardClick(product._id)}
              className="flex-shrink-0 w-32 bg-white rounded-lg border border-gray-200 p-3 relative cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative mb-2">
                <img
                  src={product.images?.[0] || defaultImage}
                  alt={product.name || "Product"}
                  className="w-full h-24 object-contain rounded"
                  onError={handleImageError}
                />
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="absolute bottom-1 right-1 bg-white border-2 border-pink-500 text-pink-500 font-bold text-xs px-2 py-1 rounded hover:bg-pink-500 hover:text-white transition-colors"
                >
                  ADD
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-black font-bold text-sm">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-xs line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {product.amountSaving > 0 && (
                  <div className="text-green-600 text-xs font-medium">
                    SAVE ₹{product.amountSaving}
                  </div>
                )}

                <div className="text-xs text-gray-600">{product.unit}</div>

                <h3 className="text-xs text-black font-medium leading-tight line-clamp-2">
                  {product.name}
                </h3>

                <div className="text-xs text-teal-600 font-medium">
                  {product.category?.[0]?.name}
                </div>

                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600 text-xs">★</span>
                    <span className="text-xs font-medium">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid View */}
      <div className="md:hidden grid grid-cols-3 gap-3">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleCardClick(product._id)}
            className="bg-white rounded-lg border border-gray-200 p-3 relative cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative mb-2">
              <img
                src={product.images?.[0] || defaultImage}
                alt={product.name || "Product"}
                className="w-full h-24 object-contain rounded"
                onError={handleImageError}
              />
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="absolute bottom-1 right-1 bg-white border-2 border-pink-500 text-pink-500 font-bold text-xs px-2 py-1 rounded hover:bg-pink-500 hover:text-white transition-colors"
              >
                ADD
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <span className="text-black font-bold text-sm">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {product.amountSaving > 0 && (
                <div className="text-green-600 text-xs font-medium">
                  SAVE ₹{product.amountSaving}
                </div>
              )}

              <div className="text-xs text-gray-600">{product.unit}</div>

              <h3 className="text-xs text-black font-medium leading-tight line-clamp-2">
                {product.name}
              </h3>

              <div className="text-xs text-teal-600 font-medium">
                {product.category?.[0]?.name}
              </div>

              {product.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-green-600 text-xs">★</span>
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCard3;
