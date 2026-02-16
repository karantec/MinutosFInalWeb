import axios from "axios";

const API_BASE_URL = "https://api.minutos.in/api/product";

const productService = {
  // ✅ Fetch by subcategory (single or multiple)
  getProductsBySubCategories: async (subCategoryIds) => {
    try {
      const subCategoriesParam = Array.isArray(subCategoryIds)
        ? subCategoryIds.join(",")
        : subCategoryIds;

      const response = await axios.get(
        `${API_BASE_URL}/subcategories?subCategories=${subCategoriesParam}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      throw error;
    }
  },

  // ✅ Fetch by category (for "All")
  getProductsByCategory: async (categoryName) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/category?category=${encodeURIComponent(categoryName)}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
};

export default productService;
