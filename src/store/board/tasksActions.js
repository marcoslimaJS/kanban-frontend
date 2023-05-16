import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const createTask = createAsyncThunk(
  'task/createTask',
  async ({ columnId, body }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/task/${columnId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async ({ taskId, body }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/task/${taskId}`, { data: body });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ taskId, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/task/${taskId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
