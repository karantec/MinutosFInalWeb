import React from "react";
import { Routes, Route } from "react-router-dom";
import PhoneAuth from "./Components/Login/OtpLogin";
import PrivateRoute from "./Components/store/PrivateRoute";
import Profile from "./Components/Profile";
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/pages/Home";
import FruitsVegetablesComponent from "./Components/shared/SubCategory";
import CategoriesSub from "./Components/home/Category";
import ProductDetailScreen from "./Components/home/ProductDetail";
export default function App() {
  return (
    <>
      {/* Always visible */}
      <Header />

      {/* Routes */}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<PhoneAuth />} />

        {/* <Route path="/" element={<Home />} /> */}
        {/* Protected Route */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/subCategory/:categoryName"
          element={<FruitsVegetablesComponent />}
        />
        <Route path="/subcategory" element={<CategoriesSub />} />

        <Route path="/product/:id" element={<ProductDetailScreen />} />

        {/* Default fallback */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Always visible */}
      <Footer />
    </>
  );
}
