import axios from "axios";

const API_URL = "https://api.minutos.in/api/category";

const getSubCategories = async (categoryName) => {
  try {
    // encodeURIComponent makes sure spaces (&, etc.) don’t break the URL
    const res = await axios.get(
      `${API_URL}/subcategories/${encodeURIComponent(categoryName)}`
    );

    return { success: true, data: res.data.subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch",
    };
  }
};

export default { getSubCategories };
