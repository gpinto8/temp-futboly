import { LeaguesCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type InitialStateProps = LeaguesCollectionProps & {
//     id?: '';
//     ownerUsername?: '';
// };

const initialState: LeaguesCollectionProps = {
    id: '',
    name: '',
    leaguePassword: '',
    shortId: '',
    isPrivate: false,
    players: {},
};

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<LeaguesCollectionProps>) {
            const { id, name, leaguePassword, shortId, isPrivate, players } = action.payload;
            state.id = id;
            state.name = name;
            state.leaguePassword = leaguePassword;
            state.shortId = shortId;
            state.isPrivate = isPrivate;
            state.players = players;
        },
    },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
