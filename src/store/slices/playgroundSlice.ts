import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PlaygroundState {
  query: string;
  variables: string;
}

const initialState: PlaygroundState = {
  query: '',
  variables: '',
};

export const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    setPlaygroundValues(state, action: PayloadAction<PlaygroundState>) {
      state.query = action.payload.query;
      state.variables = action.payload.variables;
    },
  },
});

export default playgroundSlice.reducer;
