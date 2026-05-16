import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: null,
  isAuthenticated: false,
  customGoldSellingPrice: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user_id, isAuthenticated } = action.payload;
      state.user_id = user_id;
      state.isAuthenticated = isAuthenticated;
    },
    setCustomGoldSellingPrice: (state, action) => {
      state.customGoldSellingPrice = action.payload;
    },
    logout: (state) => {
      state.user_id = null;
      state.isAuthenticated = false;
      state.customGoldSellingPrice = null;
    },
  },
});

export const { setCredentials, setCustomGoldSellingPrice, logout } = authSlice.actions;

export default authSlice.reducer;
