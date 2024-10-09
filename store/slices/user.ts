import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    username: '',
    activeLeague: '',
  },
  reducers: {
    setUser: (state, action) => {
      const { uid, username, activeLeague } = action.payload;
      state.uid = uid;
      state.username = username;
      state.activeLeague = activeLeague;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
