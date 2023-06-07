/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { createUser, loginUser, updateBoardLayout } from './authActions';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearErrorAuth: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        const { token, userId, simpleLayout } = action.payload;
        token && localStorage.setItem('token', token);
        userId && localStorage.setItem('userId', userId);
        simpleLayout && localStorage.setItem('simpleLayout', simpleLayout);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateBoardLayout.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateBoardLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        localStorage.setItem('simpleLayout', action.payload.simplelayout);
      })
      .addCase(updateBoardLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default authSlice.reducer;

export const { clearErrorAuth } = authSlice.actions;
