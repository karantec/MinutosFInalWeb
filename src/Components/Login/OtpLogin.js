import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";

export default function PhoneAuth() {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phoneForm = useFormik({
    initialValues: { phone: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");
      try {
        const payload = { phoneNumber: `+91${values.phone}` };
        const res = await axios.post(
          "https://api.minutos.in/api/auth/send-otp",
          payload
        );

        if (res.data) {
          setPhoneNumber(payload.phoneNumber);
          setStep("verify");
          setMessage("OTP sent successfully ✅");
        }
      } catch (err) {
        setMessage("Failed to send OTP ❌");
      } finally {
        setLoading(false);
      }
    },
  });

  const otpForm = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, "Enter 6 digits").required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");
      try {
        const payload = { phoneNumber, otp: values.otp };
        const res = await axios.post(
          "https://api.minutos.in/api/auth/verify-otp",
          payload
        );

        if (res.data && res.data.token) {
          dispatch(loginSuccess(res.data));
          localStorage.setItem("auth", JSON.stringify(res.data));
          setMessage("OTP verified 🎉");
          navigate("/profile");
        } else {
          setMessage("Login failed ❌");
        }
      } catch (err) {
        setMessage("Invalid OTP ❌");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 6) value = value.slice(0, 6);
    otpForm.setFieldValue("otp", value);

    if (value.length === 6) otpForm.handleSubmit();
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        "https://api.minutos.in/api/auth/resend-otp",
        { phoneNumber }
      );

      if (res.data) setMessage("OTP resent successfully 🔄");
    } catch (err) {
      setMessage("Failed to resend OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-pink-200 p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center space-y-6">
        {step === "phone" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Enter Phone Number</h1>
            <p className="text-gray-600 text-sm">We’ll send you a verification code</p>

            <form onSubmit={phoneForm.handleSubmit} className="space-y-4">
              <input
                type="text"
                name="phone"
                value={phoneForm.values.phone}
                onChange={phoneForm.handleChange}
                placeholder="Enter 10-digit phone number"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg focus:border-red-400 focus:outline-none"
                inputMode="numeric"
              />

              {phoneForm.errors.phone && (
                <p className="text-red-500 text-sm">{phoneForm.errors.phone}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-red-600 transition"
              >
                {loading ? "Sending..." : "Get OTP"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
            <p className="text-gray-600 text-sm">Please enter the 6-digit code sent to {phoneNumber}</p>

            <div className="flex justify-between space-x-3 cursor-text" onClick={() => inputRef.current.focus()}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 flex items-center justify-center text-xl font-bold border-2 rounded-2xl bg-white/80 backdrop-blur-sm transition-colors ${
                    otpForm.values.otp[i] ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  {otpForm.values.otp[i] || ""}
                </div>
              ))}

              <input
                ref={inputRef}
                type="text"
                value={otpForm.values.otp}
                onChange={handleOtpChange}
                maxLength={6}
                inputMode="numeric"
                autoFocus
                className="absolute opacity-0 pointer-events-none"
              />
            </div>

            {otpForm.errors.otp && <p className="text-red-500 text-sm">{otpForm.errors.otp}</p>}

            <button
              onClick={otpForm.handleSubmit}
              disabled={loading}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-red-600 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full mt-3 bg-gray-200 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Resend OTP
            </button>
          </>
        )}

        {message && <p className="text-sm text-center text-blue-600">{message}</p>}
      </div>
    </div>
  );
}
