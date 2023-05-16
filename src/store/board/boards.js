/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getAllBoards, createBoard, boardData, deleteBoard, updateBoard } from './boardsActions';

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    board: null,
    listBoards: null,
    refresh: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.listBoards = action.payload;
      })
      .addCase(getAllBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(boardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(boardData.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
      })
      .addCase(boardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBoard.fulfilled, (state) => {
        state.loading = false;
        state.refresh += 1;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBoard.fulfilled, (state) => {
        state.loading = false;
        state.refresh += 1;
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBoard.fulfilled, (state) => {
        state.loading = false;
        state.refresh += 1;
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default boardSlice.reducer;
