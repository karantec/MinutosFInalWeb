import React, { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function VendorRegistrationForm() {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    nominateForAwards: false,
    acceptMessages: false,
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    "Retail",
    "Wholesale",
    "Manufacturing",
    "Service Provider",
    "E-commerce",
    "Food & Beverage",
    "Technology",
    "Healthcare",
    "Other",
  ];

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return !value ? "First name is required" : "";
      case "lastName":
        return !value ? "Last name is required" : "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email is invalid";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        return "";
      case "businessName":
        return !value ? "Business name is required" : "";
      case "businessType":
        return !value ? "Business type is required" : "";
      case "streetAddress":
        return !value ? "Street address is required" : "";
      case "city":
        return !value ? "City is required" : "";
      case "state":
        return !value ? "State is required" : "";
      case "pinCode":
        if (!value) return "PIN code is required";
        if (!/^\d{6}$/.test(value)) return "PIN code must be 6 digits";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.minutos.in/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Registration successful! We'll contact you soon.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          businessName: "",
          businessType: "",
          streetAddress: "",
          city: "",
          state: "",
          pinCode: "",
          nominateForAwards: false,
          acceptMessages: false,
          latitude: "",
          longitude: "",
        });
        setTouched({});
        setErrors({});
        setTimeout(() => setSubmitStatus({ type: "", message: "" }), 5000);
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: "error",
          message:
            errorData.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 px-6 sm:px-8 py-8 sm:py-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3">
                Sell on Minutos
              </h1>
              <p className="text-center text-red-50 text-sm sm:text-base max-w-2xl mx-auto">
                Join our network of trusted partners and grow your business with
                us
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus.message && (
            <div className="mx-4 sm:mx-8 mt-6 sm:mt-8">
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${
                  submitStatus.type === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`font-medium text-sm sm:text-base ${
                    submitStatus.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-100">
                <div className="bg-red-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.firstName && errors.firstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.lastName && errors.lastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1.5 mb-0.5" />
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.email && errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1.5 mb-0.5" />
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.phone && errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="9876543210"
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-100">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Business Information
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.businessName && errors.businessName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Doe Enterprises"
                  />
                  {touched.businessName && errors.businessName && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white ${
                      touched.businessType && errors.businessType
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {touched.businessType && errors.businessType && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.businessType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-100">
                <div className="bg-red-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Business Address
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.streetAddress && errors.streetAddress
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {touched.streetAddress && errors.streetAddress && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.streetAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.city && errors.city
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Mumbai"
                  />
                  {touched.city && errors.city && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white ${
                      touched.state && errors.state
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Select state</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {touched.state && errors.state && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PIN Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      touched.pinCode && errors.pinCode
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="400001"
                    maxLength="6"
                  />
                  {touched.pinCode && errors.pinCode && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pinCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="19.0760"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="72.8777"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Preferences
                </h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all">
                  <input
                    type="checkbox"
                    name="nominateForAwards"
                    checked={formData.nominateForAwards}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Nominate for Awards
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Allow us to nominate your business for industry awards and
                      recognition
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all">
                  <input
                    type="checkbox"
                    name="acceptMessages"
                    checked={formData.acceptMessages}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Accept Marketing Messages
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Receive updates about new opportunities and platform
                      features
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold py-4 sm:py-5 px-6 rounded-xl hover:from-red-700 hover:via-red-800 hover:to-red-900 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-xl text-sm sm:text-base ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </button>
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                By registering, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
