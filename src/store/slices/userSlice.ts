import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getAuth, signOut } from 'firebase/auth';

export interface UserState {
  email: string | null;
  token: string | null;
  id: string | null;
}

const initialState: UserState = {
  email: null,
  token: null,
  id: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    removeAndLogOutUser(state) {
      const auth = getAuth();
      signOut(auth);
      state.email = null;
      state.token = null;
      state.id = null;
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
    },
  },
});

export default userSlice.reducer;
