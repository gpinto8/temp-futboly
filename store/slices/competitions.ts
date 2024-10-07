import { CompetitionsCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = CompetitionsCollectionProps & {
    documentId?: '';
    ownerUsername?: '';
};

const initialState: InitialStateProps = {
    documentId: '',
    name: '',
    ownerUsername: '',
    id: '',

};

const competitionSlice = createSlice({
    name: 'competition',
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<InitialStateProps>) {
            const competition = action.payload;
            state.name = competition.name;
            state.ownerUsername = competition.ownerUsername;
            state.documentId = competition.documentId;
        },
    },
});

export const competitionActions = competitionSlice.actions;
export const competitionReducer = competitionSlice.reducer;
