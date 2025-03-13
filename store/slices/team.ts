import { AddEditTeamModalSetTeamDataProps } from '@/components/modal/add-edit-team-modal';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = {
  teams: { [competitionId: string]: AddEditTeamModalSetTeamDataProps };
  currentTeam?: AddEditTeamModalSetTeamDataProps; // Based on current competition
};

const initialState: InitialStateProps = {
  teams: {},
  currentTeam: undefined,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentTeam: (
      state,
      action: PayloadAction<AddEditTeamModalSetTeamDataProps>,
    ) => {
      const currentTeam = action.payload;
      if (currentTeam) state.currentTeam = currentTeam;
    },
    setTeam: (
      state,
      action: PayloadAction<{
        [competitionId: string]: AddEditTeamModalSetTeamDataProps;
      }>,
    ) => {
      const team = action.payload;
      state.teams = { ...state.teams, ...team };
    },
  },
});

export const teamActions = teamSlice.actions;
export const teamReducer = teamSlice.reducer;
