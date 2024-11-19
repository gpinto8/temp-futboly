import { MappedCompetitionsProps, MappedLeaguesProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type InitialStateProps = LeaguesCollectionProps & {
//     id?: '';
//     ownerUsername?: '';
// };

const initialState: MappedLeaguesProps = {
    id: '',
    name: '',
    leaguePassword: '',
    shortId: '',
    isPrivate: false,
    players: [],
    ownerUsername: '',
};

const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<MappedLeaguesProps>) {
            const { id, name, leaguePassword, shortId, isPrivate, players, ownerUsername } = action.payload;
            state.id = id;
            state.name = name;
            state.leaguePassword = leaguePassword;
            state.shortId = shortId;
            state.isPrivate = isPrivate;
            state.players = players;
            state.ownerUsername = ownerUsername;
        },
        setLeagueCompetitions(state, action: PayloadAction<MappedCompetitionsProps[]>) {
            state.leagueCompetitions = action.payload;
        },
    },
});

export const leagueActions = leagueSlice.actions;
export const leagueReducer = leagueSlice.reducer;
