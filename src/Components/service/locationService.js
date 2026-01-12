// services/locationService.js

export const locationService = {
  // 1️⃣ Get current user location + address
  async getUserLocationWithAddress() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ success: false, error: "Geolocation not supported" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
            );
            const data = await response.json();

            const location = {
              formatted: data.display_name,
              full: data.display_name,
              coordinates: coords,
            };

            resolve({
              success: true,
              location,
            });
          } catch (error) {
            resolve({ success: false, error: "Failed to fetch address" });
          }
        },
        (error) => {
          resolve({ success: false, error: error.message });
        }
      );
    });
  },

  // 2️⃣ Save location in localStorage
  saveLocationToStorage(location) {
    try {
      let locations = JSON.parse(localStorage.getItem("recentLocations")) || [];

      locations = [
        location,
        ...locations.filter((l) => l.formatted !== location.formatted),
      ];

      localStorage.setItem(
        "recentLocations",
        JSON.stringify(locations.slice(0, 5))
      );
    } catch (err) {
      console.error("Error saving location:", err);
    }
  },

  // 3️⃣ Get saved locations (USED IN detectLocation)
  getSavedLocation() {
    try {
      return JSON.parse(localStorage.getItem("recentLocations")) || [];
    } catch {
      return [];
    }
  },

  // 4️⃣ Search location by text
  async searchLocations(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      return {
        success: true,
        data: data.map((loc) => ({
          formatted: loc.display_name,
          full: loc.display_name,
          coordinates: {
            lat: loc.lat,
            lng: loc.lon,
          },
        })),
      };
    } catch {
      return { success: false, error: "Search failed" };
    }
  },
};
