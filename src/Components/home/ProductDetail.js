/* eslint-disable */
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
  Clock,
  Info,
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

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleCartAction = async (e, p, action) => {
    if (e) e.stopPropagation();
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

  if (!product)
    return <div className="p-10 text-center">Product not found</div>;

  const productImage = safeImage(product);
  const mainCartItem = findCartItem(product._id);
  const mainQty = mainCartItem?.quantity || 0;

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // --- Reusable Card Component ---
  const ProductCard = ({ p }) => {
    const item = findCartItem(p._id);
    const qty = item?.quantity || 0;

    return (
      <div
        onClick={() => navigate(`/product/${p._id}`)}
        className="group relative border border-gray-100 rounded-xl p-3 bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3">
          <img
            src={safeImage(p)}
            alt={p.productName}
            className="h-32 md:h-40 w-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-1">
          {p.productName}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-red-600 font-bold text-base">₹{p.price}</p>
              {p.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{p.originalPrice}
                </p>
              )}
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">
              {p.unit || "Pack"}
            </span>
          </div>
          {!item ? (
            <button
              onClick={(e) => handleCartAction(e, p, "add")}
              className="w-full py-2 bg-white border border-red-500 text-red-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors uppercase"
            >
              + ADD
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

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* --- Desktop View --- */}
      <div className="hidden md:block container mx-auto px-6 py-10">
        <div className="flex gap-12 mb-16 bg-white p-10 rounded-3xl shadow-sm">
          <div className="w-1/2 sticky top-24 h-fit">
            <img
              src={productImage}
              alt={product.productName}
              className="rounded-2xl w-full h-[500px] object-contain p-4 bg-gray-50"
            />
          </div>

          <div className="w-1/2">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {product.productName}
            </h1>
            <p className="text-gray-500 mb-6 text-lg">
              {product.unit || "Pack"}
            </p>

            <div className="mb-8 flex items-baseline gap-4">
              <span className="text-4xl font-black text-gray-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-bold uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Main Product Cart Button */}
            <div className="flex gap-4 mb-10">
              {!mainCartItem ? (
                <button
                  onClick={(e) => handleCartAction(e, product, "add")}
                  className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <ShoppingCart size={20} /> ADD TO CART
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-red-50 rounded-xl p-1 border-2 border-red-600 shadow-inner">
                  <button
                    onClick={(e) => handleCartAction(e, product, "dec")}
                    className="p-3 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    {mainQty <= 1 ? <Trash2 size={22} /> : <Minus size={22} />}
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-red-700">
                      {mainQty}
                    </span>
                    <span className="text-[10px] font-bold text-red-400 uppercase">
                      In Cart
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCartAction(e, product, "inc")}
                    className="p-3 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Plus size={22} />
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-5 border rounded-xl transition-all ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "text-gray-400 border-gray-200"}`}
              >
                <Heart size={24} className={isFavorite ? "fill-red-500" : ""} />
              </button>
            </div>

            {/* Product Details Section */}
            <div className="border-t border-gray-100 pt-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Info size={18} className="text-red-600" /> Product
                  Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "No description available for this item."}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <Clock size={20} className="text-blue-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    10 Min Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <Shield size={20} className="text-green-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Quality Assured
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <RefreshCw size={20} className="text-orange-500 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Easy Returns
                  </span>
                </div>
              </div>
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
        <div className="bg-white p-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 p-2 bg-gray-100 rounded-full"
          >
            <ChevronLeft />
          </button>
          <img src={productImage} className="w-full h-64 object-contain mb-4" />
          <h1 className="text-xl font-bold">{product.productName}</h1>
          <p className="text-gray-500 mb-4">{product.unit || "Pack"}</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <div className="p-4 bg-white mt-2 mb-20">
          <h3 className="font-bold mb-2">Product Info</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
        {/* Floating Cart Button for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-4 z-50">
          {!mainCartItem ? (
            <button
              onClick={(e) => handleCartAction(e, product, "add")}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg"
            >
              ADD TO CART
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-1">
              <button
                onClick={(e) => handleCartAction(e, product, "dec")}
                className="p-2 text-red-600"
              >
                <Minus />
              </button>
              <span className="font-bold">{mainQty}</span>
              <button
                onClick={(e) => handleCartAction(e, product, "inc")}
                className="p-2 text-red-600"
              >
                <Plus />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
