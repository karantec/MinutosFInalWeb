// src/Components/home/ProductCard.js
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import HeroArea4 from "./HeroArea4";
import {
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Trash2,
} from "lucide-react";
import {
  addToCartAsync,
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
} from "../store/cartSlice";
import HeroArea2 from "./HeroArea2";

const MorningFresh = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [addingProductId, setAddingProductId] = useState(null);
  const [updatingProducts, setUpdatingProducts] = useState(new Set());

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleCardClick = (id) => {
    if (!isDragging) navigate(`/product/${id}`);
  };

  // Helper function to find cart item by product ID
  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId
    );
  };

  // ✅ Improved add to cart function with quantity handling
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login first!");
      return;
    }

    setAddingProductId(product._id);

    try {
      // Check if item already exists in cart
      const existingCartItem = findCartItem(product._id);

      if (existingCartItem) {
        // If item exists, update quantity
        await dispatch(
          updateCartItemAsync({
            userId: user.userId,
            productId: product._id,
            cartItemId: existingCartItem._id,
            quantity: existingCartItem.quantity + 1,
          })
        ).unwrap();
      } else {
        // If item doesn't exist, add new item
        await dispatch(
          addToCartAsync({
            userId: user.userId,
            productId: product._id,
            quantity: 1,
          })
        ).unwrap();
      }

      // 🔄 Fetch updated cart after adding/updating to ensure sync
      setTimeout(() => {
        dispatch(fetchCartAsync(user.userId));
      }, 500);
    } catch (err) {
      console.error("Cart operation failed:", err);
      alert("Failed to update cart. Please try again.");
    } finally {
      setAddingProductId(null);
    }
  };

  // ✅ Handle increase quantity
  const handleIncreaseQuantity = async (product, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login first!");
      return;
    }

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
        })
      ).unwrap();

      // Refresh cart data
      setTimeout(() => {
        dispatch(fetchCartAsync(user.userId));
      }, 500);
    } catch (err) {
      console.error("Failed to increase quantity:", err);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // ✅ Handle decrease quantity
  const handleDecreaseQuantity = async (product, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login first!");
      return;
    }

    const cartItem = findCartItem(product._id);
    if (!cartItem) return;

    setUpdatingProducts((prev) => new Set(prev).add(product._id));

    try {
      if (cartItem.quantity <= 1) {
        // Remove item from cart if quantity is 1
        await dispatch(
          removeFromCartAsync({
            userId: user.userId,
            cartItemId: cartItem._id,
          })
        ).unwrap();
      } else {
        // Decrease quantity
        await dispatch(
          updateCartItemAsync({
            userId: user.userId,
            productId: product._id,
            cartItemId: cartItem._id,
            quantity: cartItem.quantity - 1,
          })
        ).unwrap();
      }

      // Refresh cart data
      setTimeout(() => {
        dispatch(fetchCartAsync(user.userId));
      }, 500);
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // Carousel autoplay
  useEffect(() => {
    if (isAutoPlay && products.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 3000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlay, products.length]);

  const getCardWidth = () => (window.innerWidth < 640 ? 160 : 192);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handleStart = (e) => {
    setIsDragging(true);
    setIsAutoPlay(false);
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    setStartPos(clientX);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    setCurrentTranslate(prevTranslate + (clientX - startPos));
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    if (Math.abs(movedBy) > 50) movedBy > 0 ? goToPrevious() : goToNext();
    setCurrentTranslate(prevTranslate);
    setTimeout(() => setIsAutoPlay(true), 2000);
  };

  useEffect(() => {
    if (products.length > 0) {
      const cardWidth = getCardWidth() + 16;
      const newTranslate = -currentIndex * cardWidth;
      setPrevTranslate(newTranslate);
      setCurrentTranslate(newTranslate);
    }
  }, [currentIndex, products.length]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://api.minutos.in/api/product/subcategories?subCategories=68c90e2b44c6da7aa09c5300"
        );
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Ensure cart is fetched when user logs in
  useEffect(() => {
    if (user?.userId && cartItems.length === 0) {
      dispatch(fetchCartAsync(user.userId));
    }
  }, [user, dispatch, cartItems.length]);

  if (loading) return <p className="text-center py-6">Loading hot deals...</p>;

  return (
    <>
      <HeroArea2 />
      <section className="px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
            Hot Deals
          </h2>
          <Link
            to="/subCategory/Indian Mithai"
            className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
          >
            see all
          </Link>
        </div>

        <div className="relative group">
          {/* Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-xl"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Carousel */}
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            <div
              ref={sliderRef}
              className="flex gap-3 sm:gap-4 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${currentTranslate}px)` }}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {products.map((product) => {
                const discount =
                  product.originalPrice && product.price
                    ? Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )
                    : 0;

                // ✅ Improved cart item detection
                const cartItem = findCartItem(product._id);
                const isInCart = !!cartItem;
                const cartQuantity = cartItem?.quantity || 0;

                return (
                  <div
                    key={product._id}
                    onClick={() => handleCardClick(product._id)}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0 w-40 sm:w-48 relative"
                  >
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                        {discount}% OFF
                      </div>
                    )}

                    <div className="relative mb-3 rounded-lg p-2 h-24 sm:h-28 flex items-center justify-center">
                      <img
                        src={product.images?.[0] || defaultImage}
                        alt={product.name || "Product"}
                        className="w-full h-full object-contain pointer-events-none"
                        onError={handleImageError}
                        draggable="false"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {product.unit}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ✅ Dynamic Cart Button with Quantity Controls */}
                        {!isInCart ? (
                          // ADD Button (when not in cart)
                          <button
                            disabled={addingProductId === product._id}
                            onClick={(e) => handleAddToCart(product, e)}
                            className="font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1 border-2 min-w-[60px] justify-center bg-white border-red-600 text-red-600 hover:bg-red-50"
                          >
                            {addingProductId === product._id ? (
                              "Adding..."
                            ) : (
                              <>
                                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                ADD
                              </>
                            )}
                          </button>
                        ) : (
                          // Quantity Controls (when in cart)
                          <div className="flex items-center border-2 border-red-500 rounded-lg bg-red-50">
                            <button
                              onClick={(e) =>
                                handleDecreaseQuantity(product, e)
                              }
                              disabled={updatingProducts.has(product._id)}
                              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l"
                            >
                              {cartQuantity <= 1 ? (
                                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" />
                              ) : (
                                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                              )}
                            </button>

                            <div className="flex items-center justify-center min-w-[24px] sm:min-w-[28px] px-1 text-[10px] sm:text-xs font-bold text-red-700 bg-white border-x border-red-300">
                              {updatingProducts.has(product._id) ? (
                                <div className="w-2 h-2 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                cartQuantity
                              )}
                            </div>

                            <button
                              onClick={(e) =>
                                handleIncreaseQuantity(product, e)
                              }
                              disabled={updatingProducts.has(product._id)}
                              className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r"
                            >
                              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {products.slice(0, Math.min(products.length, 8)).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? "bg-red-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MorningFresh;
