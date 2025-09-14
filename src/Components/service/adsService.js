import axios from "axios";

const API_URL = "https://backend.minutos.shop/api/ads/get";

// Get all ads
export const fetchAds = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // return the ads data
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};
