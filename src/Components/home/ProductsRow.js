import HeroArea from "./HeroArea";

const ProductsRow = ({ data, objects }) => {
  const products = objects.map((obj) =>
    obj.data.products.map((product) => product[0])
  )[0];

  // Default image URL - you can replace this with your preferred placeholder
  const defaultImage =
    "https://cdn.grofers.com/app/images/products/sliding_image/406724a.jpg?ts=1624525137";

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Function to chunk products into groups of 3 for mobile
  const chunkProducts = (products, size) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  const productRows = chunkProducts(products, 4);

  return (
    <section className="px-4 py-4 bg-gray-50">
      <HeroArea />
      {data.show_header && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-2xl text-black">{data.title}</h2>
            {data.show_view_all && (
              <span className="text-pink-500 font-semibold cursor-pointer text-sm hover:text-pink-600 transition-colors flex items-center">
                {data.title_action} <span className="ml-1">›</span>
              </span>
            )}
          </div>
          {data.subtitle && (
            <p className="text-gray-600 text-md">{data.subtitle}</p>
          )}
        </div>
      )}

      {/* Desktop View - Horizontal Scroll */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <div className="flex space-x-3 pb-2">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 bg-white rounded-lg border border-gray-200 p-3 relative"
            >
              <div className="relative mb-2">
                <img
                  src={product.image || defaultImage}
                  alt={product.name || "Product"}
                  className="w-full h-24 object-contain rounded"
                  onError={handleImageError}
                />
                <button className="absolute bottom-1 right-1 bg-white border-2 border-pink-500 text-pink-500 font-bold text-xs px-2 py-1 rounded hover:bg-pink-500 hover:text-white transition-colors">
                  ADD
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-black font-bold text-sm">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-xs line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {product.discount && (
                  <div className="text-green-600 text-xs font-medium">
                    SAVE ₹{product.discount}
                  </div>
                )}

                <div className="text-xs text-gray-600">{product.quantity}</div>

                <h3 className="text-xs text-black font-medium leading-tight line-clamp-2">
                  {product.name}
                </h3>

                <div className="text-xs text-teal-600 font-medium">
                  {product.category}
                </div>

                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      <span className="text-green-600 text-xs">★</span>
                      <span className="text-xs font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({product.reviews})
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Grid Layout (3 per row) */}
      <div className="md:hidden space-y-3">
        {productRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-3">
            {row.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-3 relative"
              >
                <div className="relative mb-2">
                  <img
                    src={product.image || defaultImage}
                    alt={product.name || "Product"}
                    className="w-full h-24 object-contain rounded"
                    onError={handleImageError}
                  />
                  <button className="absolute bottom-1 right-1 bg-white border-2 border-pink-500 text-pink-500 font-bold text-xs px-2 py-1 rounded hover:bg-pink-500 hover:text-white transition-colors">
                    ADD
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-black font-bold text-sm">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.discount && (
                    <div className="text-green-600 text-xs font-medium">
                      SAVE ₹{product.discount}
                    </div>
                  )}

                  <div className="text-xs text-gray-600">
                    {product.quantity}
                  </div>

                  <h3 className="text-xs text-black font-medium leading-tight line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="text-xs text-teal-600 font-medium">
                    {product.category}
                  </div>

                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        <span className="text-green-600 text-xs">★</span>
                        <span className="text-xs font-medium">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({product.reviews})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsRow;
