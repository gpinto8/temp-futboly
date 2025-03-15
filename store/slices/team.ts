import { CompetitionsCollectionTeamsProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = {
  currentTeam?: CompetitionsCollectionTeamsProps; // Based on current competition
};

const initialState: InitialStateProps = {
  currentTeam: undefined,
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
  },
});

export const teamActions = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
