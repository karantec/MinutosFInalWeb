// src/pages/Mithai.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeroArea2 from "./HeroArea2";
import axios from "axios";
import HeroArea4 from "./HeroArea4";
import { Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const Mithai = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleCardClick = (id) => {
    if (!isDragging) {
      navigate(`/product/${id}`);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!isDragging) {
      alert(`${product.name} added to cart!`);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && products.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          return newIndex >= products.length ? 0 : newIndex;
        });
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, products.length]);

  // Calculate card width based on screen size
  const getCardWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) return 160; // w-40 = 160px
    return 192; // w-48 = 192px
  };

  const getVisibleCards = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) return 2;
    if (screenWidth < 768) return 3;
    if (screenWidth < 1024) return 4;
    if (screenWidth < 1280) return 5;
    return 6;
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? products.length - 1 : prevIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === products.length - 1 ? 0 : prevIndex + 1;
    });
  };

  // Touch/Mouse event handlers
  const handleStart = (e) => {
    setIsDragging(true);
    setIsAutoPlay(false);
    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    setStartPos(clientX);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;

    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startPos;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const cardWidth = getCardWidth() + 16; // card width + gap
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > 50) {
      if (movedBy > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setCurrentTranslate(prevTranslate);
    setTimeout(() => setIsAutoPlay(true), 2000);
  };

  // Update translate based on currentIndex
  useEffect(() => {
    if (products.length > 0) {
      const cardWidth = getCardWidth() + 16; // card width + gap
      const newTranslate = -currentIndex * cardWidth;
      setPrevTranslate(newTranslate);
      setCurrentTranslate(newTranslate);
    }
  }, [currentIndex, products.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://backend.minutos.shop/api/product/subcategories?subCategories=68c31d7043f5a67c5b62b07d"
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
    return <p className="text-center py-6">Loading hot Deals...</p>;
  }

  return (
    <>
      <HeroArea4 />
      <section className="px-4 py-6">
        {/* Title + See All */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
            Indian Mithai
          </h2>
          <Link
            to="/subCategory/Indian Mithai"
            className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
          >
            see all
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:shadow-xl"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:shadow-xl"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Carousel Wrapper */}
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
              style={{
                transform: `translateX(${currentTranslate}px)`,
                userSelect: isDragging ? "none" : "auto",
              }}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {products.concat(products).map((product, index) => {
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
                    key={`${product._id}-${index}`}
                    onClick={() => handleCardClick(product._id)}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200 cursor-pointer relative flex-shrink-0 w-40 sm:w-48"
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded text-[10px] z-10">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Delivery Time Badge */}

                    {/* Product Image Container */}
                    <div className="relative mb-3 rounded-lg p-2 h-24 sm:h-28 flex items-center justify-center">
                      <img
                        src={product.images?.[0] || defaultImage}
                        alt={product.name || "Product"}
                        className="w-full h-full object-contain pointer-events-none"
                        onError={handleImageError}
                        draggable="false"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight overflow-hidden line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.name}
                      </h3>

                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {product.unit}
                      </p>

                      {/* Price and Add Button */}
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

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {products.slice(0, Math.min(products.length, 8)).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? "bg-red-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Mithai;
