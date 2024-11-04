import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { errorReducer } from './slices/error';
import { userReducer } from './slices/user';
import { leagueReducer } from './slices/league';
import { competitionReducer } from './slices/competitions';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      error: errorReducer,
      user: userReducer,
      league: leagueReducer,
      competition: competitionReducer
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    // @ts-ignore
    // devTools: window?.__REDUX_DEVTOOLS_EXTENSION__ && window?.__REDUX_DEVTOOLS_EXTENSION__(), // TODO: only for dev tho
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
