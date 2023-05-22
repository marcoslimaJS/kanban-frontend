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

export const updateBoardLayout = createAsyncThunk(
  'user/updateBoardLayout',
  async ({ userId, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${userId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
