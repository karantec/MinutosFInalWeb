import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: token ? { token } : null,
  },
  reducers: {
    login: (state, action) => {
      state.user = { token: action.payload };
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
