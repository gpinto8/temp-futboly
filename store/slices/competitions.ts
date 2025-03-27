import { CompetitionsCollectionProps, MappedCompetitionsProps } from '@/firebase/db-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialStateProps = {
  competitions: CompetitionsCollectionProps[] | MappedCompetitionsProps[];
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

    // Replaces all the competitions array with the payload you pass (e.g useful on mounting)
    setAllCompetitions(
      state,
      action: PayloadAction<CompetitionsCollectionProps[]>,
    ) {
      state.competitions = action.payload;
    },

    // Set the competition you are passing throught as the active one (e.g to reactively display it on the "Overview Banner")
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
