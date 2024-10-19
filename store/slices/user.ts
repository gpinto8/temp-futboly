import { LeaguesCollectionProps } from '@/firebase/db-types';
import { createSlice } from '@reduxjs/toolkit';
import { DocumentReference } from 'firebase/firestore';
import { act } from 'react';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    username: '',
    activeLeague: null as DocumentReference<LeaguesCollectionProps> | null,
    activeCompetitions: null as any, //TODO: Think of a better type handling solution
  },
  reducers: {
    setUser: (state, action) => {
      console.log('Setting user: ', action.payload);
      const { uid, username, activeLeague, activeCompetitions } = action.payload;
      state.id = uid;
      state.username = username;
      state.activeLeague = activeLeague as DocumentReference<LeaguesCollectionProps> | null;
      state.activeCompetitions = activeCompetitions;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
