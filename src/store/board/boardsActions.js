import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const getAllBoards = createAsyncThunk(
  'board/listBoards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/board/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async ({ body, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/board/${userId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async ({ boardId, body }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/board/${boardId}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async ({ boardId, body }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/board/${boardId}`, { data: body });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const boardData = createAsyncThunk(
  'board/boardData',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/boardData/${boardId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
