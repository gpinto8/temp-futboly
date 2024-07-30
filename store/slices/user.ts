import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    username: '',
  },
  reducers: {
    setUser: (state, action) => {
      const { uid, username } = action.payload;
      state.uid = uid;
      state.username = username;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
