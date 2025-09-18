import React from "react";
import { Routes, Route } from "react-router-dom";
import PhoneAuth from "./Components/Login/OtpLogin";
import PrivateRoute from "./Components/store/PrivateRoute";
import Profile from "./Components/Profile";
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/pages/Home";
export default function App() {
  return (
    <>
      {/* Always visible */}
      <Header />

      {/* Routes */}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<PhoneAuth />} />
        <Route path="/" element={<Home />} />
        {/* Protected Route */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Default fallback */}
        <Route path="*" element={<PhoneAuth />} />
      </Routes>

      {/* Always visible */}
      <Footer />
    </>
  );
}
