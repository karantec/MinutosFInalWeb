// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
// Utility to parse JWT expiry
function getTokenExpiry(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // convert to milliseconds
  } catch (err) {
    console.error("Invalid JWT", err);
    return null;
  }
}

// Load persisted auth from localStorage
let storedAuth = { user: null, token: null };
try {
  const data = localStorage.getItem("auth");
  if (data) storedAuth = JSON.parse(data);
} catch (error) {
  console.error("Error parsing auth from localStorage", error);
}

let logoutTimeout = null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user, // will hold { userId, ... }
    token: storedAuth.token,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;

      // Decode token to extract userId
      try {
        const decoded = jwtDecode(state.token);
        // You may need to adjust field name based on your backend (userId, id, _id, etc.)
        const userId = decoded.userId || decoded.id || decoded._id;

        state.user = { userId, ...action.payload.user };
      } catch (err) {
        console.error("Failed to decode token", err);
        state.user = action.payload.user || null;
      }

      // Persist to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: state.token, user: state.user }),
      );

      // Auto-logout setup
      const expiryTime = getTokenExpiry(state.token);
      if (expiryTime) {
        const delay = expiryTime - Date.now();
        if (logoutTimeout) clearTimeout(logoutTimeout);
        if (delay > 0) {
          logoutTimeout = setTimeout(() => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("auth");
            alert("Session expired. Please login again.");
          }, delay);
        } else {
          // token already expired
          state.user = null;
          state.token = null;
          localStorage.removeItem("auth");
        }
      }
    },

    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: state.token, user: state.user }),
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
      if (logoutTimeout) clearTimeout(logoutTimeout);
    },
  },
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
