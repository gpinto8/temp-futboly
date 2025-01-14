import { CompetitionsCollectionProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = {
  competitions: CompetitionsCollectionProps[];
  activeCompetition?: CompetitionsCollectionProps;
};

const initialState: InitialStateProps = {
  competitions: [],
  activeCompetition: undefined,
};

const competitionSlice = createSlice({
  name: 'competition',
  initialState,
  reducers: {
    // Adds a competitions to the all the competitions
    setCompetition(state, action: PayloadAction<CompetitionsCollectionProps>) {
      const competition = action.payload;
      const filteredCompetitions = [
        ...(state.competitions
          ? state.competitions.filter((comp) => comp?.id !== competition.id)
          : []),
      ];
      state.competitions = [...filteredCompetitions, competition];
    },

    // Replaces all the competitions array with the payload you pass (useful on mounting (for ex.))
    setAllCompetitions(
      state,
      action: PayloadAction<CompetitionsCollectionProps[]>,
    ) {
      state.competitions = action.payload;
    },

    setActiveCompetition(
      state,
      action: PayloadAction<CompetitionsCollectionProps | undefined>,
    ) {
      state.activeCompetition = action.payload;
    },
  },
});

export const competitionActions = competitionSlice.actions;
export const competitionReducer = competitionSlice.reducer;
