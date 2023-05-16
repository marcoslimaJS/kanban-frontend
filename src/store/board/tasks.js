/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { createTask, deleteTask, updateTask } from './tasksActions';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    data: null,
    refresh: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.refresh += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.loading = false;
        state.refresh += 1;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        console.log(state);
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.loading = false;
        state.refresh += 1;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;

export const getTaskById = ({ columns }, taskId) => {
  const task = columns.reduce(
    (accum, column) => column.tasks.find(({ id }) => id === taskId) || accum,
    null,
  );
  return task;
};
