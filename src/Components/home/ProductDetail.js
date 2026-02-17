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
  Trash2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import {
  addToCartAsync,
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
} from "../store/cartSlice";
import axios from "axios";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";

// --- Mock fallback product ---
const mockProduct = {
  productName: "Quaker Oats 1kg",
  price: 400,
  discount: 20,
  description: "Nutritious and healthy oats for a healthy lifestyle.",
  images: ["/default-product.jpg"],
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
  images: ["/default-product.jpg"],
});

// --- Utility: safe image fallback (supports images[] array) ---
const safeImage = (product) => {
  if (product?.images && product.images.length > 0) return product.images[0];
  if (product?.image) return product.image;
  return "/default-product.jpg";
};

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [product, setProduct] = useState(mockProduct);
  const [products, setProducts] = useState(mockProducts);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [updatingCart, setUpdatingCart] = useState(false);

  // Fetch cart on mount if user logged in
  useEffect(() => {
    if (user?.userId && cartItems.length === 0) {
      dispatch(fetchCartAsync(user.userId));
    }
  }, [user, dispatch]);

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

  // --- Cart helpers ---
  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId,
    );
  };

  const cartItem = product?._id ? findCartItem(product._id) : null;
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    setAddingToCart(true);
    try {
      await dispatch(
        addToCartAsync({
          userId: user.userId,
          productId: product._id,
          quantity: 1,
        }),
      ).unwrap();
      setTimeout(() => dispatch(fetchCartAsync(user.userId)), 500);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (!user || !cartItem) return;
    setUpdatingCart(true);
    try {
      await dispatch(
        updateCartItemAsync({
          userId: user.userId,
          productId: product._id,
          cartItemId: cartItem._id,
          quantity: cartItem.quantity + 1,
        }),
      ).unwrap();
      setTimeout(() => dispatch(fetchCartAsync(user.userId)), 500);
    } catch (err) {
      console.error("Failed to increase quantity:", err);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingCart(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (!user || !cartItem) return;
    setUpdatingCart(true);
    try {
      if (cartItem.quantity <= 1) {
        await dispatch(
          removeFromCartAsync({
            userId: user.userId,
            cartItemId: cartItem._id,
          }),
        ).unwrap();
      } else {
        await dispatch(
          updateCartItemAsync({
            userId: user.userId,
            productId: product._id,
            cartItemId: cartItem._id,
            quantity: cartItem.quantity - 1,
          }),
        ).unwrap();
      }
      setTimeout(() => dispatch(fetchCartAsync(user.userId)), 500);
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingCart(false);
    }
  };

  // --- Cart Button UI ---
  const CartButton = ({ mobile = false }) => {
    const baseClass = mobile
      ? "w-full py-3 rounded-lg flex justify-center items-center font-semibold"
      : "px-6 py-3 rounded-lg flex items-center font-semibold";

    if (!isInCart) {
      return (
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className={`bg-red-600 text-white ${baseClass} disabled:opacity-70`}
        >
          <ShoppingCart className="mr-2 w-5 h-5" />
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>
      );
    }

    return (
      <div
        className={`flex items-center border-2 border-red-500 rounded-lg bg-red-50 ${
          mobile ? "w-full justify-between" : ""
        }`}
      >
        <button
          onClick={handleDecreaseQuantity}
          disabled={updatingCart}
          className="flex items-center justify-center w-10 h-10 hover:bg-red-100 disabled:opacity-50 rounded-l-lg"
        >
          {cartQuantity <= 1 ? (
            <Trash2 className="w-4 h-4 text-red-500" />
          ) : (
            <Minus className="w-4 h-4 text-red-600" />
          )}
        </button>

        <div className="flex items-center justify-center min-w-[40px] px-2 text-sm font-bold text-red-700 bg-white border-x border-red-300 h-10">
          {updatingCart ? (
            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            cartQuantity
          )}
        </div>

        <button
          onClick={handleIncreaseQuantity}
          disabled={updatingCart}
          className="flex items-center justify-center w-10 h-10 hover:bg-green-100 disabled:opacity-50 rounded-r-lg"
        >
          <Plus className="w-4 h-4 text-red-600" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const productImage = safeImage(product);
  const discountPercent =
    product.discount ||
    (product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Desktop View --- */}
      <div className="hidden md:block container mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Product Image */}
          <div className="w-1/2">
            <img
              src={productImage}
              alt={product.productName || product.name}
              className="rounded-lg shadow-lg w-full h-[500px] object-contain bg-white p-4"
              onError={(e) => {
                e.target.src = "/default-product.jpg";
              }}
            />
          </div>

          {/* Product Info */}
          <div className="w-1/2">
            <h1 className="text-3xl font-bold mb-2">
              {product.productName || product.name}
            </h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-2 text-sm text-gray-600">
                {product.rating || "4.5"} (120 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl font-bold">
                ₹{product.discountedMRP || product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice !== product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              {discountPercent > 0 && (
                <span className="text-green-600 font-semibold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Unit / Pack */}
            {(product.unit || product.pack) && (
              <p className="text-gray-500 text-sm mb-3">
                Pack: {product.unit || product.pack}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Highlights:</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {product.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* More Details */}
            {product.more_details?.brand && (
              <p className="text-sm text-gray-600 mb-4">
                Brand:{" "}
                <span className="font-medium">
                  {product.more_details.brand}
                </span>
              </p>
            )}

            {/* Cart Button */}
            <div className="flex gap-4 items-center mb-6">
              <CartButton />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 border rounded-lg ${
                  isFavorite ? "bg-red-100 text-red-500" : "text-gray-500"
                }`}
              >
                <Heart className={isFavorite ? "fill-red-500" : ""} />
              </button>
              <button className="p-3 border rounded-lg text-gray-500">
                <Share2 />
              </button>
            </div>

            {/* Delivery, Warranty, Return */}
            <div className="mt-4 space-y-4 text-gray-600">
              <div className="flex items-center">
                <Truck className="mr-2" /> Free Delivery in 18 mins
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
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg bg-white"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={safeImage(p)}
                  alt={p.productName || p.name}
                  className="h-40 w-full object-contain rounded"
                  onError={(e) => {
                    e.target.src = "/default-product.jpg";
                  }}
                />
                <h3 className="mt-4 text-sm font-medium line-clamp-2">
                  {p.productName || p.name}
                </h3>
                <p className="text-red-600 font-bold">
                  ₹{p.discountedMRP || p.price}
                </p>
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
              <Heart className={isFavorite ? "fill-red-500" : ""} />
            </button>
            <button>
              <Share2 />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white">
          <img
            src={productImage}
            alt={product.productName || product.name}
            className="w-full h-72 object-contain p-4"
            onError={(e) => {
              e.target.src = "/default-product.jpg";
            }}
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-white rounded-t-2xl -mt-4 relative z-10">
          <h1 className="text-xl font-bold mb-2">
            {product.productName || product.name}
          </h1>
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-2 text-sm text-gray-600">
              {product.rating || "4.5"} (120 reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold">
              ₹{product.discountedMRP || product.price}
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <span className="text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            {discountPercent > 0 && (
              <span className="text-green-600 text-sm font-semibold">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {(product.unit || product.pack) && (
            <p className="text-gray-500 text-sm mb-3">
              Pack: {product.unit || product.pack}
            </p>
          )}

          {product.description && (
            <p className="text-gray-600 mb-4">{product.description}</p>
          )}

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Highlights:</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {product.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cart Button */}
          <div className="mb-4">
            <CartButton mobile />
          </div>

          {/* Delivery, Warranty, Return */}
          <div className="mt-4 space-y-3 text-gray-600 text-sm">
            <div className="flex items-center">
              <Truck className="mr-2 w-4 h-4" /> Free Delivery in 18 mins
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 w-4 h-4" /> 1 Year Warranty
            </div>
            <div className="flex items-center">
              <RefreshCw className="mr-2 w-4 h-4" /> 7-Day Easy Returns
            </div>
          </div>

          {/* Offers */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Available Offers:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <Tag className="mr-2 text-green-600 w-4 h-4" /> 10% Instant
                Discount on HDFC Cards
              </div>
              <div className="flex items-center text-gray-700">
                <Tag className="mr-2 text-green-600 w-4 h-4" /> ₹50 Off on First
                Order
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="p-4 mt-2">
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-2 cursor-pointer bg-white"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={safeImage(p)}
                  alt={p.productName || p.name}
                  className="h-32 w-full object-contain rounded"
                  onError={(e) => {
                    e.target.src = "/default-product.jpg";
                  }}
                />
                <h3 className="mt-2 text-xs line-clamp-2">
                  {p.productName || p.name}
                </h3>
                <p className="text-red-600 font-bold text-sm">
                  ₹{p.discountedMRP || p.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
