import { LeaguesCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = LeaguesCollectionProps & {
    documentId?: '';
    ownerUsername?: '';
};

const initialState: InitialStateProps = {
    documentId: '',
    name: '',
    ownerUsername: '',
    shortId: '',
    id: '',
    isPrivate: false,
    players: [],
};

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<InitialStateProps>) {
            const league = action.payload;
            state.name = league.name;
            state.players = league.players;
            state.ownerUsername = league.ownerUsername;
            state.documentId = league.documentId;
            state.shortId = league.shortId;
        },
    },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
