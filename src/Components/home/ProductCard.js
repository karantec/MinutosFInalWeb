// src/Components/home/SubCategoryPage.js
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Plus, Minus, Trash2, ChevronLeft, ShoppingBag } from "lucide-react";
import {
  addToCartAsync,
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
} from "../store/cartSlice";

const SubCategoryPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  // ✅ Get subcategory ID from navigation state (passed when clicking category)
  const subCategoryId = location.state?.subCategoryId;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);
  const [updatingProducts, setUpdatingProducts] = useState(new Set());

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // ✅ Find cart item by product ID
  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId,
    );
  };

  // ✅ Fetch products using subcategory ID
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      // Use ID if available, otherwise fallback to name
      const queryParam = subCategoryId || encodeURIComponent(name);

      if (!queryParam) {
        setError("Invalid subcategory.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://api.minutos.in/api/product/subcategories?subCategories=${queryParam}`,
        );
        console.log("API Response:", res.data); // 👈 Check console to confirm data shape

        const data =
          res.data.data ||
          res.data.products ||
          (Array.isArray(res.data) ? res.data : []);

        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err?.response?.data || err.message);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false); // ✅ ALWAYS stop loading no matter what
      }
    };

    fetchProducts();
  }, [name, subCategoryId]);

  // ✅ Safety timeout — never stuck loading forever
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  // ✅ Fetch cart when user is available
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchCartAsync(user.userId));
    }
  }, [user, dispatch]);

  // ✅ Add to cart
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login first!");
      return;
    }
    setAddingProductId(product._id);
    try {
      const existingCartItem = findCartItem(product._id);
      if (existingCartItem) {
        await dispatch(
          updateCartItemAsync({
            userId: user.userId,
            productId: product._id,
            cartItemId: existingCartItem._id,
            quantity: existingCartItem.quantity + 1,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addToCartAsync({
            userId: user.userId,
            productId: product._id,
            quantity: 1,
          }),
        ).unwrap();
      }
      setTimeout(() => dispatch(fetchCartAsync(user.userId)), 500);
    } catch (err) {
      console.error("Cart operation failed:", err);
      alert("Failed to update cart. Please try again.");
    } finally {
      setAddingProductId(null);
    }
  };

  // ✅ Increase quantity
  const handleIncreaseQuantity = async (product, e) => {
    e.stopPropagation();
    if (!user) return;
    const cartItem = findCartItem(product._id);
    if (!cartItem) return;
    setUpdatingProducts((prev) => new Set(prev).add(product._id));
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
    } finally {
      setUpdatingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // ✅ Decrease quantity
  const handleDecreaseQuantity = async (product, e) => {
    e.stopPropagation();
    if (!user) return;
    const cartItem = findCartItem(product._id);
    if (!cartItem) return;
    setUpdatingProducts((prev) => new Set(prev).add(product._id));
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
    } finally {
      setUpdatingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 shadow-sm animate-pulse"
            >
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-8 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <p className="text-red-500 text-lg font-semibold mb-2">{error}</p>
        <p className="text-gray-400 text-sm mb-6">
          Check your internet connection or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-gray-800 capitalize">
            {decodeURIComponent(name)}
          </h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {products.length} items
        </span>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ShoppingBag size={64} className="text-gray-200 mb-4" />
          <p className="text-gray-500 text-lg font-semibold">
            No products found
          </p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            We couldn't find any products in this category.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Go Back
          </button>
        </div>
      ) : (
        // Products Grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
          {products.map((product) => {
            const discount =
              product.originalPrice && product.price
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )
                : 0;

            const cartItem = findCartItem(product._id);
            const isInCart = !!cartItem;
            const cartQuantity = cartItem?.quantity || 0;

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative flex flex-col"
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                    {discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="w-full h-28 sm:h-32 flex items-center justify-center mb-3 overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={
                      product.imageUrl ||
                      product.image ||
                      product.images?.[0] ||
                      defaultImage
                    }
                    alt={product.name}
                    onError={handleImageError}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mb-2">
                    {product.unit}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Cart Button */}
                {!isInCart ? (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingProductId === product._id}
                    className="w-full font-bold text-xs py-1.5 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                  >
                    {addingProductId === product._id ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      <>
                        <Plus size={12} />
                        ADD
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-between border-2 border-red-600 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={(e) => handleDecreaseQuantity(product, e)}
                      disabled={updatingProducts.has(product._id)}
                      className="flex items-center justify-center w-8 h-8 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {cartQuantity <= 1 ? (
                        <Trash2 size={12} className="text-red-600" />
                      ) : (
                        <Minus size={12} className="text-red-600" />
                      )}
                    </button>

                    <span className="text-sm font-bold text-red-600 min-w-[20px] text-center">
                      {updatingProducts.has(product._id) ? (
                        <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        cartQuantity
                      )}
                    </span>

                    <button
                      onClick={(e) => handleIncreaseQuantity(product, e)}
                      disabled={updatingProducts.has(product._id)}
                      className="flex items-center justify-center w-8 h-8 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      <Plus size={12} className="text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
