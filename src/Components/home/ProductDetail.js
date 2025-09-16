// // src/pages/ProductDetailScreen.jsx
// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   Heart,
//   Share2,
//   ShoppingCart,
//   Plus,
//   Minus,
//   Star,
//   Truck,
//   Shield,
// } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ProductDetailScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const defaultImage =
//     "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `https://backend.minutos.shop/api/product/${id}`
//         );

//         if (res.data && res.data.product) {
//           setProduct(res.data.product);
//         } else {
//           throw new Error("Product not found");
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         // Set a mock product for demo if API fails
//         setProduct({
//           _id: id || "demo-product",
//           name: "Quaker Oats 1kg",
//           brand: "Quaker",
//           price: 160,
//           originalPrice: 175,
//           discount: 8,
//           unit: "1kg",
//           rating: 4.2,
//           images: [defaultImage],
//           description: "High quality oats perfect for a healthy breakfast",
//           category: "Food Item",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchAllProducts = async () => {
//       try {
//         const res = await axios.get(
//           `https://backend.minutos.shop/api/product?limit=20`
//         );

//         if (res.data && res.data.data && Array.isArray(res.data.data)) {
//           setProducts(res.data.data);
//         } else {
//           throw new Error("Invalid products data");
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         // Set mock products for demo
//         setProducts([
//           {
//             _id: "mock-1",
//             name: "Amul Milk 500ml",
//             price: 29,
//             images: [defaultImage],
//           },
//           {
//             _id: "mock-2",
//             name: "Mother Dairy Milk 1L",
//             price: 67,
//             images: [defaultImage],
//           },
//           {
//             _id: "mock-3",
//             name: "Amul Gold Milk 1L",
//             price: 75,
//             images: [defaultImage],
//           },
//           {
//             _id: "mock-4",
//             name: "Nestle Milk 500ml",
//             price: 32,
//             images: [defaultImage],
//           },
//         ]);
//       }
//     };

//     if (id) {
//       fetchProduct();
//       fetchAllProducts();
//     }
//   }, [id]);

//   const incrementQuantity = () => setQuantity((prev) => prev + 1);
//   const decrementQuantity = () =>
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleAddToCart = () => {
//     console.log(`Adding ${quantity} x ${product?.name || "product"} to cart`);
//   };

//   const handleShare = () => {
//     if (navigator.share && product) {
//       navigator.share({
//         title: product.name || "Product",
//         url: window.location.href,
//       });
//     }
//   };

//   const handleProductClick = (productId) => {
//     if (productId && typeof productId === "string") {
//       navigate(`/product/${productId}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-700 mb-4">Product not found</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Safely extract product properties
//   const productName = product.name ? String(product.name) : "Product Name";
//   const productPrice = product.price ? Number(product.price) : 0;
//   const productOriginalPrice = product.originalPrice
//     ? Number(product.originalPrice)
//     : null;
//   const productRating = product.rating ? String(product.rating) : "4.0";
//   const productBrand = product.brand ? String(product.brand) : "";
//   const productCategory = product.category
//     ? String(product.category)
//     : "Food Item";
//   const productUnit = product.unit ? String(product.unit) : "500ml";
//   const productDescription = product.description
//     ? String(product.description)
//     : "";

//   // Safely handle images
//   const productImages = Array.isArray(product.images)
//     ? product.images
//     : [defaultImage];
//   const currentImage = productImages[selectedImage] || defaultImage;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
//         <div className="flex items-center justify-between p-4">
//           <ChevronLeft
//             className="w-6 h-6 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-full p-1"
//             onClick={() => navigate(-1)}
//           />
//           <h1 className="text-lg font-medium text-gray-900">Product Details</h1>
//           <div className="flex items-center space-x-4">
//             <Share2
//               className="w-5 h-5 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full p-1"
//               onClick={handleShare}
//             />
//             <Heart
//               className={`w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1 ${
//                 isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
//               }`}
//               onClick={() => setIsFavorite(!isFavorite)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="pb-20">
//         {/* Desktop Layout */}
//         <div className="hidden lg:flex">
//           {/* Left Side - Product Image */}
//           <div className="w-1/2 p-6">
//             <div className="sticky top-24">
//               {/* Main Product Image */}
//               <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
//                 <img
//                   src={currentImage}
//                   alt={productName}
//                   className="w-full h-full object-contain p-4"
//                   onError={(e) => {
//                     e.target.src = defaultImage;
//                   }}
//                 />
//               </div>

//               {/* Image Thumbnails */}
//               {productImages.length > 1 && (
//                 <div className="flex space-x-2 overflow-x-auto">
//                   {productImages.slice(0, 6).map((image, index) => (
//                     <div
//                       key={`thumb-${index}`}
//                       className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
//                         selectedImage === index
//                           ? "border-green-600"
//                           : "border-gray-200"
//                       }`}
//                       onClick={() => setSelectedImage(index)}
//                     >
//                       <img
//                         src={image || defaultImage}
//                         alt={`Product view ${index + 1}`}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src = defaultImage;
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Highlights Section */}
//               <div className="mt-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">Highlights</h3>
//                 <div className="space-y-2">
//                   <div className="text-sm">
//                     <span className="text-gray-600">Type: </span>
//                     <span className="font-medium text-gray-900">
//                       {productCategory}
//                     </span>
//                   </div>
//                   <div className="text-sm">
//                     <span className="text-gray-600">Unit: </span>
//                     <span className="font-medium text-gray-900">
//                       {productUnit}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Product Information */}
//           <div className="w-1/2 p-6 border-l border-gray-100">
//             {/* Breadcrumb */}
//             <div className="text-sm text-gray-500 mb-4">
//               Home / Products / {productCategory} / {productName}
//             </div>

//             {/* Product Title */}
//             <h1 className="text-2xl font-semibold text-gray-900 mb-2">
//               {productName}
//             </h1>

//             {/* Rating */}
//             <div className="flex items-center mb-4">
//               <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
//                 <Star className="w-3 h-3 mr-1 fill-current" />
//                 {productRating}
//               </div>
//               <span className="text-sm text-gray-500 ml-2">ratings</span>
//             </div>

//             {/* Brand */}
//             {productBrand && (
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <div className="flex items-center">
//                     <span className="font-medium text-gray-900">
//                       {productBrand}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-500 mt-1">
//                     and other products
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Price and Unit Selection */}
//             <div className="mb-6">
//               <div className="text-sm font-medium text-gray-900 mb-3">
//                 Select Unit
//               </div>
//               <div className="flex space-x-3 mb-4">
//                 <div className="border-2 border-green-600 rounded-lg p-3 text-center bg-green-50 flex-1">
//                   <div className="text-sm font-medium">{productUnit}</div>
//                   <div className="text-lg font-bold text-green-600">
//                     ₹{productPrice}
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <div className="text-lg font-bold">₹{productPrice}</div>
//                 {productOriginalPrice &&
//                   productOriginalPrice > productPrice && (
//                     <div className="text-sm text-gray-500">
//                       MRP{" "}
//                       <span className="line-through">
//                         ₹{productOriginalPrice}
//                       </span>
//                       <span className="text-green-600 ml-2">
//                         {Math.round(
//                           ((productOriginalPrice - productPrice) /
//                             productOriginalPrice) *
//                             100
//                         )}
//                         % OFF
//                       </span>
//                     </div>
//                   )}
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
//               >
//                 Add to cart
//               </button>
//             </div>

//             {/* Why shop section */}
//             <div className="mb-8">
//               <h3 className="font-semibold text-gray-900 mb-4">
//                 Why shop from us?
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                     <Truck className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-900">
//                       Superfast Delivery
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Get your order delivered to your doorstep at the earliest.
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                     <span className="text-yellow-600 font-bold text-xs">%</span>
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-900">
//                       Best Prices & Offers
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Best price destination with offers directly from
//                       manufacturers.
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                     <Shield className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-900">
//                       Wide Assortment
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Choose from thousands of products across multiple
//                       categories.
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Similar Products */}
//             {Array.isArray(products) && products.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="font-semibold text-gray-900 mb-4">
//                   Similar products
//                 </h3>
//                 <div className="grid grid-cols-3 gap-4">
//                   {products.slice(0, 6).map((p) => {
//                     // Safely extract product properties
//                     const pId = p._id
//                       ? String(p._id)
//                       : `product-${Math.random()}`;
//                     const pName = p.name ? String(p.name) : "Product Name";
//                     const pPrice = p.price ? Number(p.price) : 0;
//                     const pImage =
//                       Array.isArray(p.images) && p.images[0]
//                         ? p.images[0]
//                         : defaultImage;

//                     return (
//                       <div
//                         key={pId}
//                         className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => handleProductClick(pId)}
//                       >
//                         <div className="aspect-square bg-gray-50 rounded-md mb-2 overflow-hidden">
//                           <img
//                             src={pImage}
//                             alt={pName}
//                             className="w-full h-full object-contain p-1"
//                             onError={(e) => {
//                               e.target.src = defaultImage;
//                             }}
//                           />
//                         </div>
//                         <div className="text-xs text-gray-600 mb-1">4 mins</div>
//                         <div className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-8">
//                           {pName}
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="text-sm font-bold">₹{pPrice}</div>
//                           <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
//                             ADD
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Layout */}
//         <div className="lg:hidden">
//           {/* Product Image */}
//           <div className="p-4">
//             <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
//               <img
//                 src={currentImage}
//                 alt={productName}
//                 className="w-full h-full object-contain p-4"
//                 onError={(e) => {
//                   e.target.src = defaultImage;
//                 }}
//               />
//             </div>

//             {/* Image Thumbnails */}
//             {productImages.length > 1 && (
//               <div className="flex space-x-2 overflow-x-auto pb-2">
//                 {productImages.slice(0, 6).map((image, index) => (
//                   <div
//                     key={`mobile-thumb-${index}`}
//                     className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
//                       selectedImage === index
//                         ? "border-green-600"
//                         : "border-gray-200"
//                     }`}
//                     onClick={() => setSelectedImage(index)}
//                   >
//                     <img
//                       src={image || defaultImage}
//                       alt={`View ${index + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = defaultImage;
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="p-4">
//             <h1 className="text-xl font-semibold text-gray-900 mb-2">
//               {productName}
//             </h1>

//             <div className="flex items-center mb-4">
//               <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
//                 <Star className="w-3 h-3 mr-1 fill-current" />
//                 {productRating}
//               </div>
//               <span className="text-sm text-gray-500 ml-2">ratings</span>
//             </div>

//             <div className="mb-4">
//               <div className="text-2xl font-bold">₹{productPrice}</div>
//               {productOriginalPrice && productOriginalPrice > productPrice && (
//                 <div className="text-sm text-gray-500">
//                   MRP{" "}
//                   <span className="line-through">₹{productOriginalPrice}</span>
//                   <span className="text-green-600 ml-2">
//                     {Math.round(
//                       ((productOriginalPrice - productPrice) /
//                         productOriginalPrice) *
//                         100
//                     )}
//                     % OFF
//                   </span>
//                 </div>
//               )}
//             </div>

//             {productDescription && (
//               <div className="mb-4">
//                 <p className="text-gray-600 text-sm">{productDescription}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Bottom Bar */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center border border-red-600 rounded-lg">
//             <button
//               onClick={decrementQuantity}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-l-lg"
//             >
//               <Minus className="w-4 h-4" />
//             </button>
//             <span className="px-3 py-2 font-bold text-red-600">{quantity}</span>
//             <button
//               onClick={incrementQuantity}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-r-lg"
//             >
//               <Plus className="w-4 h-4" />
//             </button>
//           </div>

//           <button
//             onClick={handleAddToCart}
//             className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold ml-4 flex items-center justify-center hover:bg-red-700 transition-colors"
//           >
//             <ShoppingCart className="w-4 h-4 mr-2" />
//             ADD • ₹{(productPrice * quantity).toFixed(2)}
//           </button>
//         </div>

//         {productOriginalPrice && productOriginalPrice > productPrice && (
//           <div className="text-center mt-2 text-sm text-green-600">
//             You save ₹
//             {((productOriginalPrice - productPrice) * quantity).toFixed(2)} on
//             this order!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
