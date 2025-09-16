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
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://backend.minutos.shop/api/product/${id}`
        );

        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        // Set a mock product for demo if API fails
        setProduct({
          _id: id || "demo-product",
          name: "Quaker Oats 1kg",
          brand: "Quaker",
          price: 160,
          originalPrice: 175,
          discount: 8,
          unit: "1kg",
          rating: 4.2,
          images: [defaultImage],
          description: "High quality oats perfect for a healthy breakfast",
          category: "Food Item",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(
          `https://backend.minutos.shop/api/product?limit=20`
        );

        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else {
          throw new Error("Invalid products data");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        // Set mock products for demo
        setProducts([
          {
            _id: "mock-1",
            name: "Amul Milk 500ml",
            price: 29,
            images: [defaultImage],
          },
          {
            _id: "mock-2",
            name: "Mother Dairy Milk 1L",
            price: 67,
            images: [defaultImage],
          },
          {
            _id: "mock-3",
            name: "Amul Gold Milk 1L",
            price: 75,
            images: [defaultImage],
          },
          {
            _id: "mock-4",
            name: "Nestle Milk 500ml",
            price: 32,
            images: [defaultImage],
          },
        ]);
      }
    };

    if (id) {
      fetchProduct();
      fetchAllProducts();
    }
  }, [id]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} x ${product?.name || "product"} to cart`);
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name || "Product",
        url: window.location.href,
      });
    }
  };

  const handleProductClick = (productId) => {
    if (productId && typeof productId === "string") {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Safely extract product properties
  const productName = product.name ? String(product.name) : "Product Name";
  const productPrice = product.price ? Number(product.price) : 0;
  const productOriginalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : null;
  const productDiscountedMRP = product.discountedMRP
    ? Number(product.discountedMRP)
    : null;
  const productDiscount = product.discount ? Number(product.discount) : 0;
  const productAmountSaving = product.amountSaving
    ? Number(product.amountSaving)
    : 0;
  const productRating = product.rating ? String(product.rating) : "4.0";
  const productBrand = product.more_details?.brand
    ? String(product.more_details.brand)
    : "";
  const productCategory =
    Array.isArray(product.category) && product.category[0]?.name
      ? String(product.category[0].name)
      : "Food Item";
  const productSubCategory =
    Array.isArray(product.subCategory) && product.subCategory[0]?.name
      ? String(product.subCategory[0].name)
      : "";
  const productUnit = product.unit ? String(product.unit) : "500ml";
  const productDescription = product.description
    ? String(product.description)
    : "";
  const productStock = product.stock ? Number(product.stock) : 0;
  const productPack = product.pack ? String(product.pack) : "";
  const productExpiry = product.more_details?.expiry
    ? String(product.more_details.expiry)
    : "";
  const productFullName = product.productName
    ? String(product.productName)
    : "";

  // Safely handle images
  const productImages = Array.isArray(product.images)
    ? product.images
    : [defaultImage];
  const currentImage = productImages[selectedImage] || defaultImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <ChevronLeft
            className="w-6 h-6 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-full p-1"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-lg font-medium text-gray-900">
            {productCategory}
          </h1>
          <div className="flex items-center space-x-4">
            <Share2
              className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full p-1"
              onClick={handleShare}
            />
            <Heart
              className={`w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            />
          </div>
        </div>
      </div>

      {/* Main Content Container - Centered and Constrained */}
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden mt-4 mb-4 lg:mb-8">
        <div className="pb-20 lg:pb-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex">
            {/* Left Side - Product Image */}
            <div className="w-1/2 p-8">
              <div className="sticky top-24">
                {/* Main Product Image */}
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-6 relative shadow-sm">
                  <img
                    src={currentImage}
                    alt={productName}
                    className="w-full h-full object-contain p-6"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>

                {/* Image Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto">
                    {productImages.slice(0, 6).map((image, index) => (
                      <div
                        key={`thumb-${index}`}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-3 cursor-pointer flex-shrink-0 transition-all ${
                          selectedImage === index
                            ? "border-green-600 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image || defaultImage}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights Section */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {productName}
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Category: </span>
                      <span className="font-medium text-gray-900">
                        {productCategory}
                      </span>
                    </div>
                    {productSubCategory && (
                      <div className="text-sm">
                        <span className="text-gray-600">Sub Category: </span>
                        <span className="font-medium text-gray-900">
                          {productSubCategory}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-gray-600">Unit: </span>
                      <span className="font-medium text-gray-900">
                        {productUnit}
                      </span>
                    </div>
                    {productPack && (
                      <div className="text-sm">
                        <span className="text-gray-600">Packaging: </span>
                        <span className="font-medium text-gray-900">
                          {productPack}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-gray-600">Stock Available: </span>
                      <span
                        className={`font-medium ${
                          productStock > 50
                            ? "text-green-600"
                            : productStock > 10
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {productStock} units
                      </span>
                    </div>
                    {productExpiry && (
                      <div className="text-sm">
                        <span className="text-gray-600">Best Before: </span>
                        <span className="font-medium text-gray-900">
                          {new Date(productExpiry).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    )}
                    {productBrand && (
                      <div className="text-sm">
                        <span className="text-gray-600">Brand: </span>
                        <span className="font-medium text-gray-900">
                          {productBrand}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Product Information */}
            <div className="w-1/2 p-8 border-l border-gray-100">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500 mb-6">
                Home / Products / {productCategory}{" "}
                {productSubCategory ? `/ ${productSubCategory}` : ""} /{" "}
                {productName}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productName}
              </h1>
              {productFullName && productFullName !== productName && (
                <p className="text-lg text-gray-600 mb-4">{productFullName}</p>
              )}

              {/* Rating and Stock */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {productRating}
                  </div>
                  <span className="text-sm text-gray-500 ml-3">ratings</span>
                </div>
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    productStock > 50
                      ? "bg-green-100 text-green-800"
                      : productStock > 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {productStock > 0
                    ? `${productStock} in stock`
                    : "Out of stock"}
                </div>
              </div>

              {/* Brand */}
              {productBrand && (
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900 text-lg">
                        {productBrand}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      and other products
                    </div>
                  </div>
                </div>
              )}

              {/* Price and Unit Selection */}
              <div className="mb-8">
                <div className="text-sm font-semibold text-gray-900 mb-4">
                  Select Unit
                </div>
                <div className="flex space-x-4 mb-6">
                  <div className="border-3 border-green-600 rounded-xl p-4 text-center bg-green-50 flex-1 shadow-sm">
                    <div className="text-sm font-semibold text-gray-700">
                      {productUnit}
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ₹{productDiscountedMRP || productPrice}
                    </div>
                    {productDiscount > 0 && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        {productDiscount}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Details */}
                <div className="mb-6 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      Selling Price: ₹{productDiscountedMRP || productPrice}
                    </span>
                    {productDiscount > 0 && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {productDiscount}% OFF
                      </span>
                    )}
                  </div>

                  {productOriginalPrice &&
                    productOriginalPrice >
                      (productDiscountedMRP || productPrice) && (
                      <div className="text-sm text-gray-500 mb-1">
                        <span>Original Price: </span>
                        <span className="line-through">
                          ₹{productOriginalPrice}
                        </span>
                      </div>
                    )}

                  {productAmountSaving > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      You save: ₹{productAmountSaving}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={productStock === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-md hover:shadow-lg ${
                    productStock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {productStock === 0 ? "Out of Stock" : "Add to cart"}
                </button>
              </div>

              {/* Why shop section */}
              <div className="mb-10">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">
                  Why shop from us?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        Superfast Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Get your order delivered to your doorstep at the
                        earliest.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-yellow-600 font-bold text-lg">
                        %
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        Best Prices & Offers
                      </div>
                      <div className="text-sm text-gray-600">
                        Best price destination with offers directly from
                        manufacturers.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        Wide Assortment
                      </div>
                      <div className="text-sm text-gray-600">
                        Choose from thousands of products across multiple
                        categories.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Products */}
              {Array.isArray(products) && products.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">
                    Similar products
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {products.slice(0, 6).map((p) => {
                      // Safely extract product properties
                      const pId = p._id
                        ? String(p._id)
                        : `product-${Math.random()}`;
                      const pName = p.name ? String(p.name) : "Product Name";
                      const pPrice = p.price ? Number(p.price) : 0;
                      const pImage =
                        Array.isArray(p.images) && p.images[0]
                          ? p.images[0]
                          : defaultImage;

                      return (
                        <div
                          key={pId}
                          className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
                          onClick={() => handleProductClick(pId)}
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
                            <img
                              src={pImage}
                              alt={pName}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.target.src = defaultImage;
                              }}
                            />
                          </div>
                          <div className="text-xs text-green-600 mb-1 font-medium">
                            4 mins
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-8">
                            {pName}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold">₹{pPrice}</div>
                            <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium">
                              ADD
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Product Image */}
            <div className="p-6">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-6 relative shadow-sm">
                <img
                  src={currentImage}
                  alt={productName}
                  className="w-full h-full object-contain p-6"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {productImages.slice(0, 6).map((image, index) => (
                    <div
                      key={`mobile-thumb-${index}`}
                      className={`w-18 h-18 rounded-lg overflow-hidden border-3 cursor-pointer flex-shrink-0 ${
                        selectedImage === index
                          ? "border-green-600"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image || defaultImage}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {productName}
              </h1>
              {productFullName && productFullName !== productName && (
                <p className="text-base text-gray-600 mb-4">
                  {productFullName}
                </p>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {productRating}
                  </div>
                  <span className="text-sm text-gray-500 ml-3">ratings</span>
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    productStock > 50
                      ? "bg-green-100 text-green-800"
                      : productStock > 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {productStock} left
                </div>
              </div>

              {/* Mobile Price Details */}
              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{productDiscountedMRP || productPrice}
                  </span>
                  {productDiscount > 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {productDiscount}% OFF
                    </span>
                  )}
                </div>

                {productOriginalPrice &&
                  productOriginalPrice >
                    (productDiscountedMRP || productPrice) && (
                    <div className="text-sm text-gray-500 mb-1">
                      <span>Original Price: </span>
                      <span className="line-through">
                        ₹{productOriginalPrice}
                      </span>
                    </div>
                  )}

                {productAmountSaving > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    You save: ₹{productAmountSaving}
                  </div>
                )}
              </div>

              {/* Product Details for Mobile */}
              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {productName}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{productCategory}</span>
                  </div>
                  {productSubCategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Category:</span>
                      <span className="font-medium">{productSubCategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit:</span>
                    <span className="font-medium">{productUnit}</span>
                  </div>
                  {productPack && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Packaging:</span>
                      <span className="font-medium">{productPack}</span>
                    </div>
                  )}
                  {productBrand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{productBrand}</span>
                    </div>
                  )}
                  {productExpiry && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Before:</span>
                      <span className="font-medium">
                        {new Date(productExpiry).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {productDescription && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {productDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center border-2 border-red-600 rounded-xl overflow-hidden">
            <button
              onClick={decrementQuantity}
              className="p-3 text-red-600 hover:bg-red-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 font-bold text-red-600">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-3 text-red-600 hover:bg-red-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={productStock === 0}
            className={`flex-1 py-4 px-6 rounded-xl font-bold ml-4 flex items-center justify-center transition-colors shadow-md ${
              productStock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {productStock === 0
              ? "OUT OF STOCK"
              : `ADD • ₹${(
                  (productDiscountedMRP || productPrice) * quantity
                ).toFixed(2)}`}
          </button>
        </div>

        {productAmountSaving > 0 && (
          <div className="text-center mt-3 text-sm text-green-600 font-medium">
            You save ₹{(productAmountSaving * quantity).toFixed(2)} on this
            order!
          </div>
        )}
      </div>
    </div>
  );
}
