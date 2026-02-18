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
  // ✅ Use scrollRef for native scroll-based carousel
  const scrollRef = useRef(null);
  const autoPlayRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [updatingProducts, setUpdatingProducts] = useState(new Set());

  const defaultImage =
    "https://api.minutos.in/api/product/subcategories?subCategories=6958faf9a44f26ca052e35fd";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleCardClick = (id) => {
    if (!isDraggingRef.current) navigate(`/product/${id}`);
  };

  // Helper function to find cart item by product ID
  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId,
    );
  };

  // ✅ Scroll helpers
  const getCardWidth = () => {
    const card = scrollRef.current?.querySelector(".product-card");
    return card
      ? card.offsetWidth + 12
      : (window.innerWidth < 640 ? 160 : 192) + 12;
  };

  const scrollToNext = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: getCardWidth() * 2,
      behavior: "smooth",
    });
  };

  const scrollToPrev = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: -getCardWidth() * 2,
      behavior: "smooth",
    });
  };

  // ✅ Autoplay using scrollBy
  useEffect(() => {
    if (isAutoPlay && products.length > 0) {
      autoPlayRef.current = setInterval(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          // Reset to start
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({
            left: getCardWidth(),
            behavior: "smooth",
          });
        }
      }, 3000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlay, products.length]);

  // ✅ Mouse drag handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = false; // reset, will set true on move
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    setIsAutoPlay(false);
    scrollRef.current.style.cursor = "grabbing";
    // attach move/up to window so we don't miss events
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) isDraggingRef.current = true;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    scrollRef.current.style.cursor = "grab";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    setTimeout(() => {
      isDraggingRef.current = false;
      setIsAutoPlay(true);
    }, 100);
  };

  // ✅ Touch drag handlers
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].pageX;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    setIsAutoPlay(false);
  };

  const handleTouchMove = (e) => {
    const walk = (startXRef.current - e.touches[0].pageX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current + walk;
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsAutoPlay(true), 2000);
  };

  // ✅ Cart handlers (unchanged)
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
        }),
      ).unwrap();
      setTimeout(() => dispatch(fetchCartAsync(user.userId)), 500);
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    } finally {
      setUpdatingProducts((prev) => {
        const s = new Set(prev);
        s.delete(product._id);
        return s;
      });
    }
  };

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
        const s = new Set(prev);
        s.delete(product._id);
        return s;
      });
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://api.minutos.in/api/product/subcategories?subCategories=695807eea44f26ca052e33a4",
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
            Baby food
          </h2>
          <Link
            to="/subCategory/Baby%20Care"
            className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
          >
            see all
          </Link>
        </div>

        {/* ✅ Relative wrapper for arrow positioning */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={scrollToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-xl -translate-x-2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-xl translate-x-2"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* ✅ Scroll container - overflow-x-hidden hides scrollbar, scroll happens via JS */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-hidden scroll-smooth cursor-grab select-none w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => {
              setIsAutoPlay(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
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
                  onClick={() => handleCardClick(product._id)}
                  // ✅ product-card class used by getCardWidth() + flex-shrink-0 prevents squishing
                  className="product-card bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex-shrink-0 w-40 sm:w-48 relative"
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

                      {!isInCart ? (
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
                        <div className="flex items-center border-2 border-red-500 rounded-lg bg-red-50">
                          <button
                            onClick={(e) => handleDecreaseQuantity(product, e)}
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
                            onClick={(e) => handleIncreaseQuantity(product, e)}
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
      </section>
    </>
  );
};

export default MorningFresh;
