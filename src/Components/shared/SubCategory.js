import React, { useState, useEffect } from "react";
import { Search, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import subcategoryService from "../service/subcategoryService";
import productService from "../service/productService";
import {
  addToCartAsync,
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
} from "../store/cartSlice";

import { Clock, Plus, Minus, Trash2 } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";

const FruitsVegetablesComponent = () => {
  const { categoryName } = useParams();
  const dispatch = useAppDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "All",
    name: "All",
    showIcon: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);
  const [updatingProducts, setUpdatingProducts] = useState(new Set());

  // Ensure cart is fetched when user logs in
  useEffect(() => {
    if (user?.userId && cartItems.length === 0) {
      dispatch(fetchCartAsync(user.userId));
    }
  }, [user, dispatch, cartItems.length]);

  // Helper: find cart item by product ID
  const findCartItem = (productId) => {
    return cartItems.find(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.product?._id === productId,
    );
  };

  // Add to cart
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

  // Increase quantity
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

  // Decrease quantity / remove
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

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setError(null);
        const decodedCategoryName = decodeURIComponent(categoryName);
        const result =
          await subcategoryService.getSubCategories(decodedCategoryName);

        if (result.success) {
          setSubCategories([
            { _id: "All", name: "All", showIcon: true },
            ...result.data,
          ]);
        } else {
          setSubCategories([{ _id: "All", name: "All", showIcon: true }]);
        }
        setSelectedCategory({ _id: "All", name: "All", showIcon: true });
        setProducts([]);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("Failed to load subcategories");
        setSubCategories([{ _id: "All", name: "All", showIcon: true }]);
        setSelectedCategory({ _id: "All", name: "All", showIcon: true });
        setProducts([]);
      }
    };

    fetchSubCategories();
  }, [categoryName]);

  // Fetch products when selected category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedCategory._id === "All") {
          const realSubCategories = subCategories.filter(
            (sub) => sub._id !== "All",
          );

          if (realSubCategories.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
          }

          const results = await Promise.all(
            realSubCategories.map((sub) =>
              productService.getProductsBySubCategories(sub._id),
            ),
          );

          const allProducts = results
            .filter((result) => result.success)
            .flatMap((result) => result.data);

          const unique = Array.from(
            new Map(allProducts.map((p) => [p._id, p])).values(),
          );

          setProducts(unique);
        } else {
          const result = await productService.getProductsBySubCategories(
            selectedCategory._id,
          );

          if (result.success) {
            setProducts(result.data);
          } else {
            setError("Failed to load products");
            setProducts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (subCategories.length > 0) {
      fetchProducts();
    }
  }, [selectedCategory, subCategories]);

  // Filter products by search
  const filteredProducts = products.filter(
    (product) =>
      searchQuery === "" ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.more_details?.brand &&
        product.more_details.brand
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const defaultImage =
      "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

    const handleImageError = (e) => {
      e.target.src = defaultImage;
    };

    const handleNavigate = () => {
      navigate(`/product/${product._id}`);
    };

    const discount =
      product.originalPrice && (product.discountedMRP || product.price)
        ? Math.round(
            ((product.originalPrice -
              (product.discountedMRP || product.price)) /
              product.originalPrice) *
              100,
          )
        : 0;

    const cartItem = findCartItem(product._id);
    const isInCart = !!cartItem;
    const cartQuantity = cartItem?.quantity || 0;

    return (
      <div
        onClick={handleNavigate}
        className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200 cursor-pointer relative w-full"
      >
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded text-[10px] z-10">
            {discount}% OFF
          </div>
        )}

        <div className="flex items-center gap-1 mb-2">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500" />
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
            18 MINS
          </span>
        </div>

        <div className="relative mb-3 rounded-lg p-2 h-32 sm:h-36 flex items-center justify-center">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : defaultImage
            }
            alt={product.productName || product.name}
            className="w-full h-full object-contain pointer-events-none"
            onError={handleImageError}
            draggable="false"
          />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight overflow-hidden line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.productName || product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-gray-500">
            {product.unit || product.pack}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  ₹{product.discountedMRP || product.price}
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
                className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1 min-w-[60px] justify-center"
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span>›</span>
          <span>{decodeURIComponent(categoryName)}</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            {selectedCategory?.name || "All"}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Fresh {decodeURIComponent(categoryName)}
        </h1>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-16 sm:w-20 md:w-48 lg:w-64 flex-shrink-0">
            <div className="space-y-4">
              {subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedCategory(sub)}
                  className={`w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 rounded-xl text-center sm:text-left transition-all duration-200 ${
                    selectedCategory._id === sub._id
                      ? "bg-red-50 text-red-500 font-semibold border-2 border-red-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                      sub.showIcon || !sub.image ? "bg-gray-100" : ""
                    }`}
                  >
                    {sub.showIcon || sub._id === "All" ? (
                      <Package
                        className={`w-5 h-5 ${
                          selectedCategory._id === sub._id
                            ? "text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    ) : sub.image ? (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Package
                        className={`w-5 h-5 ${
                          selectedCategory._id === sub._id
                            ? "text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-tight">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } found`}
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-16 border-b-2 border-red-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitsVegetablesComponent;
