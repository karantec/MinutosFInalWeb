import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Popular Searches Section */}
      <div className="px-6 py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Popular Searches
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Products:</h4>
              <p className="text-sm text-gray-500">
                Avocado | Strawberry | Pomegranate | Beetroot | Ash guard |
                Bottle guard | Lady finger | Potatoes | Lemon | Dabbin |
                Fenugreek seeds | Blueberry | Pizza | Dragon fruit | Madricorn |
                Lettuce
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Brands:</h4>
              <p className="text-sm text-gray-500">
                Yukui | My Muse | Ambrosia Alta | Too Varma | Layzi | Fique
                Olive Oil | Nandan Villa | Awai | Mother Dairy New Me | Fortune
                Oil | Superyou | Dacre Condoms | Ferris and Pixels
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Categories:</h4>
              <p className="text-sm text-gray-500">
                Grocery | Capsules | Chips | Cork | Hookah Brewer | Plain shop
                near me | Eggs price | Cheese slice | Fresh fruits | Fresh
                vegetables | Refined oil | Butter price | Paneer price
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Categories</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Fruits & Vegetables
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Atta, Rice, Oil & Dal
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Masala & Dry Fruits
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Sweet Cravings
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Frozen Food & Ice Cream
              </h4>
            </div>

            <div>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Baby Food
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Dairy, Bread & Eggs
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Cold Drinks & Juices
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Munchies
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Meats, Fish & Eggs
              </h4>
            </div>

            <div>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Breakfast & Sauces
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Tea, Coffee & More
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Biscuits
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Makeup & Beauty
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Bath & Body
              </h4>
            </div>

            <div>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Cleaning Essentials
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Home Needs
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Pharmaceuticals & Accessories
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Hygiene & Grooming
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Health & Baby Care
              </h4>
            </div>

            <div>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Humayama Brands
              </h4>
              <h4 className="mb-2 text-sm text-gray-500 font-medium">
                Paar Corner
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* TOP FOOTER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center">
              <img
                src="minitos.png"
                alt="Minutos Logo"
                className="h-8 w-auto mr-3"
              />

              <span className="ml-4 text-sm text-gray-500">
                © Minutos Technologies India Pvt. Ltd.
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Home
              </Link>
              <Link
                to="/delivery-areas"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Delivery Areas
              </Link>
              <Link
                to="/careers"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Careers
              </Link>
              <Link
                to="/support"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Customer Support
              </Link>
              <Link
                to="/press"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Press
              </Link>
              <Link
                to="/blog"
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* MID FOOTER */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Terms of Use
                </Link>
                <Link
                  to="/disclosure"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Responsible Disclosure Policy
                </Link>
                <Link
                  to="/sell"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Sell on Minutos
                </Link>
                <Link
                  to="/deliver"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Deliver with Minutos
                </Link>
                <Link
                  to="/franchise"
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Franchise with Minutos
                </Link>
              </div>

              {/* Download App */}
              <div className="flex flex-col items-start gap-3">
                <h4 className="font-semibold text-sm text-gray-800">
                  Download App
                </h4>
                <div className="flex flex-col gap-3">
                  <button className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z"
                        fill="#32BBFF"
                      />
                      <path
                        d="M14.5 12.707l3.844 3.844-10.735 6.035L14.5 12.707z"
                        fill="#F9BB00"
                      />
                      <path
                        d="M18.344 8.449L22.35 10.6c.433.243.65.63.65 1.054 0 .425-.217.81-.65 1.054l-4.006 2.15-3.844-3.844 3.844-3.565z"
                        fill="#F15B2A"
                      />
                      <path
                        d="M14.5 11.293L7.609 4.402l10.735-6.035L14.5 11.293z"
                        fill="#8BC53F"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      Get it on play store
                    </span>
                  </button>
                  <button className="h-12 px-6 bg-white border border-gray-300 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      Get it on app store
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL ICONS */}
          <div className="mt-6 flex justify-center md:justify-start">
            <div className="flex gap-4">
              <div className="cursor-pointer w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaFacebookF size={14} />
              </div>
              <div className="cursor-pointer w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaTwitter size={14} />
              </div>
              <div className="cursor-pointer w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaInstagram size={14} />
              </div>
              <div className="cursor-pointer w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaLinkedinIn size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
