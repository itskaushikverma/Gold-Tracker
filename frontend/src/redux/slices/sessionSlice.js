import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  sellPriceOverride: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { isAuthenticated } = action.payload;
      state.isAuthenticated = isAuthenticated;
    },
    logout: () => initialState,
    setSellPriceOverride: (state, action) => {
      state.sellPriceOverride = action.payload;
    },
  },
});

export const { setCredentials, logout, setSellPriceOverride } = sessionSlice.actions;

export default sessionSlice.reducer;
