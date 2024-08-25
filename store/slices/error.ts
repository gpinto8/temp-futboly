import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: '',
  },
  reducers: {
    setError: (state, action) => {
      const { message } = action.payload;
      if (message) {
        const endDotMessage = message.at(-1) === '.' ? message : message + '.';
        state.message = endDotMessage;
      }
    },
  },
});

export const errorActions = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
