import { Route, Routes } from "react-router-dom";

import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/pages/Home";

import SettingsPage from "./Components/shared/Profile";
import FruitsVegetablesComponent from "./Components/shared/SubCategory";
const App = () => {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<SettingsPage />} />
        <Route
          path="/subCategory/:categoryName"
          element={<FruitsVegetablesComponent />}
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
