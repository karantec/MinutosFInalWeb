import axios from "axios";

const API_BASE_URL = "https://backend.minutos.shop/api/product";

const productService = {
  getProductsBySubCategories: async (subCategoryIds) => {
    try {
      // Convert array to comma-separated string if needed
      const subCategoriesParam = Array.isArray(subCategoryIds)
        ? subCategoryIds.join(",")
        : subCategoryIds;

      const response = await axios.get(
        `${API_BASE_URL}/subcategories?subCategories=${subCategoriesParam}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};

export default productService;
