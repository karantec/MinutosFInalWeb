// src/pages/ProductDetailScreen.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Tag,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// --- Mock fallback product ---
const mockProduct = {
  productName: "Quaker Oats 1kg",
  price: 400,
  discount: 20,
  description: "Nutritious and healthy oats for a healthy lifestyle.",
  image: "/default-product.jpg",
  highlights: [
    "100% Wholegrain Oats",
    "Rich in Fiber & Protein",
    "Helps Reduce Cholesterol",
  ],
};

// --- Mock fallback products list ---
const mockProducts = Array(6).fill({
  _id: "1",
  productName: "Parle G 250g",
  price: 100,
  discount: 5,
  image: "/default-product.jpg",
});

// --- Utility: safe image fallback ---
const safeImage = (img) => img || "/default-product.jpg";

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(mockProduct);
  const [products, setProducts] = useState(mockProducts);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Fetch product + all products in parallel ---
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      axios.get(`https://api.minutos.in/api/product/${id}`).catch(() => null),
      axios
        .get(`https://api.minutos.in/api/product?limit=20`)
        .catch(() => null),
    ])
      .then(([productRes, productsRes]) => {
        if (productRes?.data?.product) {
          setProduct(productRes.data.product);
        } else {
          setProduct(mockProduct);
        }

        if (Array.isArray(productsRes?.data?.data)) {
          setProducts(productsRes.data.data);
        } else {
          setProducts(mockProducts);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Handlers ---
  const handleAddToCart = () => {
    if (product && quantity > 0) {
      console.log(`Added ${quantity} × ${product.productName} to cart`);
      // TODO: connect with Cart Context/Redux
    }
  };

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Desktop View --- */}
      <div className="hidden md:block container mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Product Images */}
          <div className="w-1/2">
            <img
              src={safeImage(product.image)}
              alt={product.productName}
              className="rounded-lg shadow-lg w-full h-[500px] object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="ml-2 text-sm text-gray-600">
                4.5 (120 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.discount > 0 && (
                <span className="ml-2 text-green-600">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Highlights */}
            {product.highlights && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Highlights:</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {product.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center mb-6">
              <button
                onClick={decrementQuantity}
                className="p-2 border rounded-l-lg"
              >
                <Minus />
              </button>
              <span className="px-4 py-2 border-t border-b">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-2 border rounded-r-lg"
              >
                <Plus />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center"
              >
                <ShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 border rounded-lg ${
                  isFavorite ? "bg-red-100 text-red-500" : "text-gray-500"
                }`}
              >
                <Heart />
              </button>
              <button className="p-3 border rounded-lg text-gray-500">
                <Share2 />
              </button>
            </div>

            {/* Delivery, Warranty, Return */}
            <div className="mt-8 space-y-4 text-gray-600">
              <div className="flex items-center">
                <Truck className="mr-2" /> Free Delivery in 2-3 days
              </div>
              <div className="flex items-center">
                <Shield className="mr-2" /> 1 Year Warranty
              </div>
              <div className="flex items-center">
                <RefreshCw className="mr-2" /> 7-Day Easy Returns
              </div>
            </div>

            {/* Offers */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Available Offers:</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Tag className="mr-2 text-green-600" /> 10% Instant Discount
                  on HDFC Cards
                </div>
                <div className="flex items-center text-gray-700">
                  <Tag className="mr-2 text-green-600" /> ₹50 Off on First Order
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
          <div className="grid grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={safeImage(p.image)}
                  alt={p.productName}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="mt-4 text-lg font-medium">{p.productName}</h3>
                <p className="text-green-600 font-bold">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : "text-gray-500"}
            >
              <Heart />
            </button>
            <button>
              <Share2 />
            </button>
          </div>
        </div>

        {/* Image */}
        <img
          src={safeImage(product.image)}
          alt={product.productName}
          className="w-full h-72 object-cover"
        />

        {/* Info */}
        <div className="p-4 bg-white rounded-t-2xl -mt-6 relative z-10">
          <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="ml-2 text-sm text-gray-600">
              4.5 (120 reviews)
            </span>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.discount > 0 && (
              <span className="ml-2 text-green-600">
                {product.discount}% OFF
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Highlights */}
          {product.highlights && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Highlights:</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {product.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center mb-6">
            <button
              onClick={decrementQuantity}
              className="p-2 border rounded-l-lg"
            >
              <Minus />
            </button>
            <span className="px-4 py-2 border-t border-b">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-2 border rounded-r-lg"
            >
              <Plus />
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-3 rounded-lg flex justify-center items-center"
          >
            <ShoppingCart className="mr-2" /> Add to Cart
          </button>

          {/* Delivery, Warranty, Return */}
          <div className="mt-6 space-y-3 text-gray-600">
            <div className="flex items-center">
              <Truck className="mr-2" /> Free Delivery in 2-3 days
            </div>
            <div className="flex items-center">
              <Shield className="mr-2" /> 1 Year Warranty
            </div>
            <div className="flex items-center">
              <RefreshCw className="mr-2" /> 7-Day Easy Returns
            </div>
          </div>

          {/* Offers */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Available Offers:</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Tag className="mr-2 text-green-600" /> 10% Instant Discount on
                HDFC Cards
              </div>
              <div className="flex items-center text-gray-700">
                <Tag className="mr-2 text-green-600" /> ₹50 Off on First Order
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-2 cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={safeImage(p.image)}
                  alt={p.productName}
                  className="h-32 w-full object-cover rounded"
                />
                <h3 className="mt-2 text-sm">{p.productName}</h3>
                <p className="text-red-600 font-bold text-sm">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
