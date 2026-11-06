import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: null,
  sellPriceOverride: false,
  userEmail: null,
  userName: null,
  userAvatar: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { isAuthenticated, userEmail, userName, userAvatar } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.userEmail = userEmail;
      state.userName = userName;
      state.userAvatar = userAvatar;
    },
    logout: () => ({
      ...initialState,
      isAuthenticated: false,
    }),
    setSellPriceOverride: (state, action) => {
      state.sellPriceOverride = action.payload;
    },
  },
});

export const { setCredentials, logout, setSellPriceOverride } = sessionSlice.actions;

export default sessionSlice.reducer;
