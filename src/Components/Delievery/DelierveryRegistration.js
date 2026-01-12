import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const DeliveryRegistration = () => {
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "10 digits required")
      .required("Phone required"),
    dob: Yup.date().required("DOB required"),
    gender: Yup.string().required("Gender required"),
    address: Yup.string().required("Address required"),
    city: Yup.string().required("City required"),
    state: Yup.string().required("State required"),
    pincode: Yup.string()
      .matches(/^\d{6}$/, "6 digits")
      .required("Pincode required"),
    aadharNumber: Yup.string()
      .matches(/^\d{12}$/, "12 digits")
      .required("Required"),
    panNumber: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN")
      .required("Required"),
    drivingLicense: Yup.string().required("Required"),
    vehicleType: Yup.string().required("Required"),
    vehicleNumber: Yup.string().required("Required"),
    bankAccount: Yup.string()
      .matches(/^\d{9,18}$/, "Invalid account")
      .required("Required"),
    ifscCode: Yup.string()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC")
      .required("Required"),
    emergencyContact: Yup.string().required("Required"),
    emergencyPhone: Yup.string()
      .matches(/^\d{10}$/, "10 digits")
      .required("Required"),
    profilePhoto: Yup.mixed().required("Required"),
    aadharPhoto: Yup.mixed().required("Required"),
    panPhoto: Yup.mixed().required("Required"),
    licensePhoto: Yup.mixed().required("Required"),
    vehiclePhoto: Yup.mixed().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      aadharNumber: "",
      panNumber: "",
      drivingLicense: "",
      vehicleType: "",
      vehicleNumber: "",
      bankAccount: "",
      ifscCode: "",
      emergencyContact: "",
      emergencyPhone: "",
      profilePhoto: null,
      aadharPhoto: null,
      panPhoto: null,
      licensePhoto: null,
      vehiclePhoto: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      alert("✅ Registration successful! Check console for data.");
    },
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) formik.setFieldValue(name, files[0]);
  };

  const inputClass =
    "w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-300 hover:border-red-300";
  const fileClass =
    "w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-red-500 file:to-rose-500 file:text-white file:font-semibold hover:file:from-red-600 hover:file:to-rose-600 cursor-pointer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-red-50 to-orange-100 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 mb-3">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Become a delivery partner today!
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"></div>
            <div className="h-1 w-4 bg-orange-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-red-100">
          <div className="space-y-10">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Details
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📸</span> Profile Photo *
                  </label>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={fileClass}
                  />
                  {formik.values.profilePhoto && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      ✓ {formik.values.profilePhoto.name}
                    </p>
                  )}
                  {formik.touched.profilePhoto &&
                    formik.errors.profilePhoto && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠️ {formik.errors.profilePhoto}
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("fullName")}
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    className={inputClass}
                    placeholder="your.email@example.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...formik.getFieldProps("phone")}
                    className={inputClass}
                    placeholder="10-digit number"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DOB *
                  </label>
                  <input
                    type="date"
                    {...formik.getFieldProps("dob")}
                    className={inputClass}
                  />
                  {formik.touched.dob && formik.errors.dob && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.dob}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    {...formik.getFieldProps("gender")}
                    className={inputClass + " bg-white"}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Address</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    {...formik.getFieldProps("address")}
                    rows="3"
                    className={inputClass + " resize-none"}
                    placeholder="House/Flat No., Street"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.address}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("city")}
                      className={inputClass}
                      placeholder="City"
                    />
                    {formik.touched.city && formik.errors.city && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("state")}
                      className={inputClass}
                      placeholder="State"
                    />
                    {formik.touched.state && formik.errors.state && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("pincode")}
                      className={inputClass}
                      placeholder="6-digit"
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("aadharNumber")}
                    className={inputClass}
                    placeholder="12-digit"
                    maxLength="12"
                  />
                  {formik.touched.aadharNumber &&
                    formik.errors.aadharNumber && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.aadharNumber}
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Aadhar *
                  </label>
                  <input
                    type="file"
                    name="aadharPhoto"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className={fileClass}
                  />
                  {formik.values.aadharPhoto && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ {formik.values.aadharPhoto.name}
                    </p>
                  )}
                  {formik.touched.aadharPhoto && formik.errors.aadharPhoto && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.aadharPhoto}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("panNumber")}
                    className={inputClass}
                    placeholder="ABCDE1234F"
                    maxLength="10"
                    style={{ textTransform: "uppercase" }}
                  />
                  {formik.touched.panNumber && formik.errors.panNumber && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.panNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload PAN *
                  </label>
                  <input
                    type="file"
                    name="panPhoto"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className={fileClass}
                  />
                  {formik.values.panPhoto && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ {formik.values.panPhoto.name}
                    </p>
                  )}
                  {formik.touched.panPhoto && formik.errors.panPhoto && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.panPhoto}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Driving License *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("drivingLicense")}
                    className={inputClass}
                    placeholder="DL number"
                  />
                  {formik.touched.drivingLicense &&
                    formik.errors.drivingLicense && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.drivingLicense}
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload License *
                  </label>
                  <input
                    type="file"
                    name="licensePhoto"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className={fileClass}
                  />
                  {formik.values.licensePhoto && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ {formik.values.licensePhoto.name}
                    </p>
                  )}
                  {formik.touched.licensePhoto &&
                    formik.errors.licensePhoto && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.licensePhoto}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Vehicle</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    {...formik.getFieldProps("vehicleType")}
                    className={inputClass + " bg-white"}
                  >
                    <option value="">Select</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                  </select>
                  {formik.touched.vehicleType && formik.errors.vehicleType && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.vehicleType}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("vehicleNumber")}
                    className={inputClass}
                    placeholder="XX-00-XX-0000"
                    style={{ textTransform: "uppercase" }}
                  />
                  {formik.touched.vehicleNumber &&
                    formik.errors.vehicleNumber && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.vehicleNumber}
                      </p>
                    )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Photo *
                  </label>
                  <input
                    type="file"
                    name="vehiclePhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={fileClass}
                  />
                  {formik.values.vehiclePhoto && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ {formik.values.vehiclePhoto.name}
                    </p>
                  )}
                  {formik.touched.vehiclePhoto &&
                    formik.errors.vehiclePhoto && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.vehiclePhoto}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Bank */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Bank Details
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("bankAccount")}
                    className={inputClass}
                    placeholder="Account number"
                  />
                  {formik.touched.bankAccount && formik.errors.bankAccount && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.bankAccount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("ifscCode")}
                    className={inputClass}
                    placeholder="ABCD0123456"
                    maxLength="11"
                    style={{ textTransform: "uppercase" }}
                  />
                  {formik.touched.ifscCode && formik.errors.ifscCode && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.ifscCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div className="pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Emergency Contact
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("emergencyContact")}
                    className={inputClass}
                    placeholder="Name"
                  />
                  {formik.touched.emergencyContact &&
                    formik.errors.emergencyContact && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.emergencyContact}
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    {...formik.getFieldProps("emergencyPhone")}
                    className={inputClass}
                    placeholder="10-digit"
                  />
                  {formik.touched.emergencyPhone &&
                    formik.errors.emergencyPhone && (
                      <p className="text-red-500 text-sm mt-2">
                        {formik.errors.emergencyPhone}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={formik.handleSubmit}
                className="relative px-12 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Submit Registration
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRegistration;
