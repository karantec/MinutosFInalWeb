import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../service/cartService";
import { logout } from "./authSlice"; // ✅ import your logout action — adjust path if needed

// ✅ Async thunk: fetch cart
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User not logged in");
      const response = await cartService.getCart(userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Async thunk: add item to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User not logged in");
      const response = await cartService.addToCart(userId, productId, quantity);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Async thunk: update cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, productId, quantity, cartItemId }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User not logged in");
      const response = await cartService.updateCartItem(
        userId,
        productId,
        quantity,
        cartItemId,
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Async thunk: remove item
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("User not logged in");
      const response = await cartService.removeFromCart(userId, productId);
      return { productId, cart: response };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Initial state
const initialState = {
  cartItems: [],
  cartTotal: 0,
  status: "idle",
  error: null,
  loading: false,
};

// ✅ Utility: recalc totals
const calculateTotal = (items) =>
  items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

// ✅ Utility: find cart item by various ID patterns
const findCartItemIndex = (cartItems, targetItem) => {
  return cartItems.findIndex(
    (item) =>
      item._id === targetItem._id ||
      item._id === targetItem.productId ||
      item.productId === targetItem._id ||
      item.productId === targetItem.productId,
  );
};

// ✅ Create slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotal = 0;
      state.status = "idle";
      state.error = null;
    },
    updateCartItemLocally: (state, action) => {
      const { productId, quantity } = action.payload;
      const index = state.cartItems.findIndex(
        (item) => item._id === productId || item.productId === productId,
      );
      if (index >= 0) {
        state.cartItems[index].quantity = quantity;
        state.cartTotal = calculateTotal(state.cartItems);
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ KEY FIX: automatically clear cart when user logs out
      .addCase(logout, (state) => {
        state.cartItems = [];
        state.cartTotal = 0;
        state.status = "idle";
        state.error = null;
        state.loading = false;
      })

      // fetch cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.cartItems = action.payload.items || [];
        state.cartTotal = calculateTotal(state.cartItems);
        state.error = null;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;

        const responseData = action.payload;

        if (responseData.items) {
          state.cartItems = responseData.items;
        } else if (responseData._id) {
          const newItem = responseData;
          const index = findCartItemIndex(state.cartItems, newItem);
          if (index >= 0) {
            state.cartItems[index] = newItem;
          } else {
            state.cartItems.push(newItem);
          }
        }

        state.cartTotal = calculateTotal(state.cartItems);
        state.error = null;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      })

      // update cart item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;

        const responseData = action.payload;

        if (responseData.items) {
          state.cartItems = responseData.items;
        } else if (responseData._id) {
          const updatedItem = responseData;
          const index = findCartItemIndex(state.cartItems, updatedItem);
          if (index >= 0) {
            state.cartItems[index] = updatedItem;
          }
        }

        state.cartTotal = calculateTotal(state.cartItems);
        state.error = null;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to update cart item";
        console.error("Cart update failed:", action.payload);
      })

      // remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        const { productId, cart } = action.payload;

        if (cart?.items) {
          state.cartItems = cart.items;
        } else {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== productId && item.productId !== productId,
          );
        }

        state.cartTotal = calculateTotal(state.cartItems);
        state.error = null;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to remove from cart";
      });
  },
});

// ✅ Export actions & reducer
export const { clearCart, updateCartItemLocally } = cartSlice.actions;
export default cartSlice.reducer;
