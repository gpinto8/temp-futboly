import { LeaguesCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = LeaguesCollectionProps & {
  documentId?: '';
  ownerUsername?: '';
};

const initialState: InitialStateProps = {
  documentId: '',
  name: '',
  competitions: [],
  owner: null as any,
  ownerUsername: '',
  teams: [],
  shortId: '',
  id: '',
  isPrivate: false,
  players: [],
  specificPosition: false,
};

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {
    setLeague(state, action: PayloadAction<InitialStateProps>) {
      const league = action.payload;
      state.name = league.name;
      state.competitions = league.competitions;
      state.owner = league.owner;
      state.teams = league.teams;
      state.players = league.players;
      state.ownerUsername = league.ownerUsername;
      state.documentId = league.documentId;
      state.shortId = league.shortId;
    },
    setCompetition: (
      state,
      action: PayloadAction<InitialStateProps['competitions'][0]>,
    ) => {
      const competition = action.payload;
      state.competitions = [...(state.competitions || []), competition];
    },
    setAllCompetitions: (
      state,
      action: PayloadAction<InitialStateProps['competitions']>,
    ) => {
      state.competitions = action.payload;
    },
    setAllTeams: (state, action: PayloadAction<InitialStateProps['teams']>) => {
      state.teams = action.payload;
    },
  },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
