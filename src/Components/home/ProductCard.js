import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroArea2 from "./HeroArea2";
import axios from "axios";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    alert(`${product.name} added to cart!`);
  };

  // Navigate to Product Details
  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://backend.minutos.shop/api/product/subcategories?subCategories=68c1c506f575c2b6c50e98d0"
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

  if (loading) {
    return <p className="text-center py-6">Loading products...</p>;
  }

  return (
    <section className="px-4 py-4 bg-gray-50">
      <HeroArea2 />

      <div className="mb-4">
        <h2 className="font-bold text-2xl text-black">
          Chemist Store Products
        </h2>
      </div>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 justify-center">
        {products.map((product) => {
          const discount =
            product.originalPrice && product.price
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )
              : 0;

          return (
            <div
              key={product._id}
              className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-3 cursor-pointer hover:shadow-md transition"
              onClick={() => handleCardClick(product._id)}
            >
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {discount}% OFF
                </div>
              )}

              {/* Product Image */}
              <img
                src={product.images?.[0] || defaultImage}
                alt={product.name || "Product"}
                className="w-full h-24 object-contain mb-2"
                onError={handleImageError}
              />

              {/* Delivery Time */}
              <p className="text-gray-500 text-[11px] flex items-center mb-1">
                ⏱ 18 MINS
              </p>

              {/* Product Name */}
              <h3 className="text-xs font-medium text-black leading-tight line-clamp-2 mb-1">
                {product.name}
              </h3>

              {/* Unit */}
              <p className="text-[11px] text-gray-500 mb-1">{product.unit}</p>

              {/* Price Section */}
              <div className="flex items-center space-x-1 mb-2">
                <span className="font-bold text-black text-sm">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-[11px] line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Add Button */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="w-full border border-red-600 text-red-600 font-semibold text-xs py-1 rounded hover:bg-red-600 hover:text-white transition"
              >
                ADD
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCard;
