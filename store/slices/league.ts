import { LeaguesCollectionProps } from '@/firebase/firestore/types';
import { createSlice } from '@reduxjs/toolkit';

const leagueSlice = createSlice({
  name: 'league',
  initialState: {
    name: '',
    competitions: [],
    owner: null,
    teams: [],
  } as LeaguesCollectionProps,
  reducers: {
    setLeague: (state, action) => {
      const league = action.payload;
      state.name = league.name;
      state.competitions = league.competitions;
      state.owner = league.owner;
      state.teams = league.teams;
    },
  },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
