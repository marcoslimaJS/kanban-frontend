import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const createUser = createAsyncThunk(
  'auth/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUserData = createAsyncThunk(
  'user/getUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async ({ userId, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${userId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
