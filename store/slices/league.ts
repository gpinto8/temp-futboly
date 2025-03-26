import { MappedLeaguesProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MappedLeaguesProps = {
  id: '',
  name: '',
  leaguePassword: '',
  shortId: '',
  isPrivate: false,
  players: [],
  ownerUsername: '',
  owner: '',
};

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {
    setLeague(state, action: PayloadAction<MappedLeaguesProps>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.leaguePassword = action.payload.leaguePassword;
      state.shortId = action.payload.shortId;
      state.isPrivate = action.payload.isPrivate;
      state.players = action.payload.players;
      state.ownerUsername = action.payload.ownerUsername;
      state.owner = action.payload.owner;
      state.competitionsNo = action.payload.competitionsNo;
    },
  },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
