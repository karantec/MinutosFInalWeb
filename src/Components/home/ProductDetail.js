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

const mockProducts = Array(6).fill({
  _id: "1",
  productName: "Parle G 250g",
  price: 100,
  discount: 5,
  images: ["/default-product.jpg"],
});

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

  useEffect(() => {
    if (user?.userId && cartItems.length === 0) {
      dispatch(fetchCartAsync(user.userId));
    }
  }, [user, dispatch]);

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
        if (productRes?.data?.product) setProduct(productRes.data.product);
        if (Array.isArray(productsRes?.data?.data))
          setProducts(productsRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId,
    );
  };

  // Shared Cart Logic for Similar Products
  const handleCartAction = async (e, p, action) => {
    e.stopPropagation(); // Prevents navigating to product detail
    if (!user) return alert("Please login first!");

    const item = findCartItem(p._id);

    try {
      if (action === "add") {
        await dispatch(
          addToCartAsync({
            userId: user.userId,
            productId: p._id,
            quantity: 1,
          }),
        ).unwrap();
      } else if (action === "inc") {
        await dispatch(
          updateCartItemAsync({
            userId: user.userId,
            productId: p._id,
            cartItemId: item._id,
            quantity: item.quantity + 1,
          }),
        ).unwrap();
      } else if (action === "dec") {
        if (item.quantity <= 1) {
          await dispatch(
            removeFromCartAsync({ userId: user.userId, cartItemId: item._id }),
          ).unwrap();
        } else {
          await dispatch(
            updateCartItemAsync({
              userId: user.userId,
              productId: p._id,
              cartItemId: item._id,
              quantity: item.quantity - 1,
            }),
          ).unwrap();
        }
      }
      dispatch(fetchCartAsync(user.userId));
    } catch (err) {
      console.error("Cart action failed", err);
    }
  };

  // --- Reusable Similar Card Component ---
  const ProductCard = ({ p, isMobile = false }) => {
    const item = findCartItem(p._id);
    const qty = item?.quantity || 0;

    return (
      <div
        onClick={() => navigate(`/product/${p._id}`)}
        className="group relative border border-gray-100 rounded-xl p-3 bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3">
          <img
            src={safeImage(p)}
            alt={p.productName}
            className="h-32 md:h-40 w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-1">
          {p.productName || p.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-red-600 font-bold text-base">
                ₹{p.discountedMRP || p.price}
              </p>
              {p.originalPrice && p.originalPrice !== p.price && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{p.originalPrice}
                </p>
              )}
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">
              {p.unit || "Pack"}
            </span>
          </div>

          {/* Cart Button logic for Card */}
          {!item ? (
            <button
              onClick={(e) => handleCartAction(e, p, "add")}
              className="w-full py-2 bg-white border border-red-500 text-red-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors uppercase tracking-wider"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between bg-red-600 rounded-lg overflow-hidden h-8">
              <button
                onClick={(e) => handleCartAction(e, p, "dec")}
                className="flex-1 h-full flex items-center justify-center hover:bg-red-700 text-white"
              >
                {qty <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
              </button>
              <span className="px-2 text-white font-bold text-xs">{qty}</span>
              <button
                onClick={(e) => handleCartAction(e, p, "inc")}
                className="flex-1 h-full flex items-center justify-center hover:bg-red-700 text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Existing logic for Main Product (Omitted for brevity, use same as your original) ---
  const cartItem = product?._id ? findCartItem(product._id) : null;
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // ... (Keep handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity from your snippet)

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

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
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* --- Desktop View --- */}
      <div className="hidden md:block container mx-auto px-6 py-10">
        <div className="flex gap-8 mb-16">
          <div className="w-1/2">
            <img
              src={productImage}
              alt={product.productName}
              className="rounded-2xl shadow-sm w-full h-[500px] object-contain bg-white p-4"
            />
          </div>
          <div className="w-1/2">
            {/* ... Your original product info UI ... */}
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold">
                ₹{product.discountedMRP || product.price}
              </span>
              {discountPercent > 0 && (
                <span className="text-green-600 font-semibold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <div className="flex gap-4 mb-6">
              {/* Your original CartButton component goes here */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 border rounded-lg ${isFavorite ? "bg-red-100 text-red-500" : "text-gray-500"}`}
              >
                <Heart className={isFavorite ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-red-600 pl-4">
          Similar Products
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, 5).map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden">
        {/* ... Header & Main Image ... */}
        <div className="p-4 bg-white rounded-t-3xl -mt-4 relative z-10">
          <h1 className="text-xl font-bold mb-4">{product.productName}</h1>
          <div className="mb-6">
            {/* Use your mobile CartButton logic here */}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Customers also bought
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p._id} p={p} isMobile />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
