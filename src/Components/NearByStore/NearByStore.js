import React, { useState, useEffect } from "react";
import { MapPin, Store, Navigation, Check } from "lucide-react";

export default function StoreSelector() {
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Downtown Store",
      address: "123 Main St",
      distance: 2.3,
      lat: 40.7128,
      lng: -74.006,
    },
    {
      id: 2,
      name: "Westside Market",
      address: "456 West Ave",
      distance: 3.7,
      lat: 40.7589,
      lng: -73.9851,
    },
    {
      id: 3,
      name: "Eastgate Shopping",
      address: "789 East Blvd",
      distance: 1.5,
      lat: 40.7489,
      lng: -73.968,
    },
    {
      id: 4,
      name: "Northpoint Plaza",
      address: "321 North St",
      distance: 4.2,
      lat: 40.7829,
      lng: -73.9654,
    },
    {
      id: 5,
      name: "South Central Store",
      address: "654 South Rd",
      distance: 5.1,
      lat: 40.6892,
      lng: -74.0445,
    },
  ]);

  const [selectedStore, setSelectedStore] = useState(null);
  const [autoSelected, setAutoSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and auto-select nearest store
    setTimeout(() => {
      const sortedStores = [...stores].sort((a, b) => a.distance - b.distance);
      setStores(sortedStores);
      setSelectedStore(sortedStores[0]);
      setAutoSelected(true);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setAutoSelected(false);
  };

  const handleConfirm = () => {
    alert(`Store confirmed: ${selectedStore.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Finding nearby stores...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Select Your Store</h1>
                <p className="text-red-100 text-sm mt-1">
                  Choose a store or continue with nearest location
                </p>
              </div>
            </div>
          </div>

          {/* Auto-selected notification */}
          {autoSelected && selectedStore && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 rounded-r-lg">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">
                  Nearest store auto-selected:{" "}
                  <span className="font-bold">{selectedStore.name}</span>
                </p>
              </div>
            </div>
          )}

          {/* Store List */}
          <div className="p-6 space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedStore?.id === store.id
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedStore?.id === store.id
                            ? "bg-red-600"
                            : "bg-gray-100"
                        }`}
                      >
                        <Store
                          className={`w-5 h-5 ${
                            selectedStore?.id === store.id
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {store.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-2 ml-14">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">{store.address}</p>
                    </div>

                    <div className="ml-14">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                        <Navigation className="w-3 h-3" />
                        {store.distance} km away
                      </span>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedStore?.id === store.id && (
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 p-6 border-t">
            <button
              onClick={handleConfirm}
              disabled={!selectedStore}
              className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Check className="w-5 h-5" />
              Confirm Selection
            </button>

            {selectedStore && (
              <p className="text-center text-sm text-gray-600 mt-3">
                Selected:{" "}
                <span className="font-semibold text-gray-800">
                  {selectedStore.name}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
