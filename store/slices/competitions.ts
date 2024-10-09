import { CompetitionsCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// type InitialStateProps = CompetitionsCollectionProps & {
//     documentId?: '';
//     ownerUsername?: '';
// };

const initialState: Partial<CompetitionsCollectionProps> = {
    id: '',
    name: '',
    //startDate: '',
    //endDate: '',
    specificPosition: false,
    //league: '',
    currentWeek: 0,
    maxWeek: 0,
    teams: [],
    standings: [],
    matchSchedule: [],
};

const competitionSlice = createSlice({
    name: 'competition',
    initialState,
    reducers: {
        setCompetition(state, action: PayloadAction<CompetitionsCollectionProps>) {
            const competition = action.payload;
            state.id = competition.id;
            state.name = competition.name;
            state.startDate = competition.startDate;
            state.endDate = competition.endDate;
            state.specificPosition = competition.specificPosition;
            state.league = competition.league;
            state.currentWeek = competition.currentWeek;
            state.maxWeek = competition.maxWeek;
            state.teams = competition.teams;
            state.standings = competition.standings;
            state.matchSchedule = competition.matchSchedule;
        },
    },
});

export const competitionActions = competitionSlice.actions;
export const competitionReducer = competitionSlice.reducer;
