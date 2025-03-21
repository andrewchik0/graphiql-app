import { PreloadedState, combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import playgroundSlice from './slices/playgroundSlice';
import { apiSlice } from './slices/apiSlice';

const rootReducer = combineReducers({
  userSlice,
  playgroundSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
