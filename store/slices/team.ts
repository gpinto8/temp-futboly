import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = {
  currentTeam?: CompetitionsCollectionTeamsProps; // Based on current competition
  refreshAdminTeams?: number; // Instead of saving all teams from all competitions, we just have a flag to signal if it has to be refresh or not
};

const initialState: InitialStateProps = {
  currentTeam: undefined,
  refreshAdminTeams: 0,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentTeam: (
      state,
      action: PayloadAction<CompetitionsCollectionTeamsProps>,
    ) => {
      const currentTeam = action.payload;
      if (currentTeam) state.currentTeam = currentTeam;
    },
    deleteCurrentTeam: (state) => (state.currentTeam = undefined),
    refreshAdminTeams: (state) => {
      state.refreshAdminTeams = Math.random();
    },
  },
});

export const teamActions = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
