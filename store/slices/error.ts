import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: '',
  },
  reducers: {
    setError: (state, action) => {
      const { message } = action.payload;
      state.message = message;
    },
  },
});

export const errorActions = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
