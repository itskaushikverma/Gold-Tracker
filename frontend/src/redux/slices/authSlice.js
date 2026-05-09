import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: null,
  isAuthenticated: false,
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
    logout: (state) => {
      state.user_id = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
