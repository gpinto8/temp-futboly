import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { errorReducer } from './slices/error';
import { userReducer } from './slices/user';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      error: errorReducer,
      user: userReducer,
    }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
