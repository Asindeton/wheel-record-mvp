import { ILoginResponse } from '../../../api/auth/EmployeeAuthApi.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState extends ILoginResponse {}

const initialState: AuthState = {
  access_token: '',
  token_type: '',
  expires_in: 0,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<ILoginResponse>) => {
      state.token_type = payload.token_type;
      state.expires_in = payload.expires_in;
      state.access_token = payload.access_token;
    },
    checkToken: (state) => {
      const token = import.meta.env.VITE_AUTH_TOKEN;
      const token_type = import.meta.env.VITE_AUTH_TYPE;
      if (token && token_type) {
        state.access_token = token;
        state.token_type = token_type;
      }
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { setCredentials, checkToken, logout } = slice.actions;

export default slice.reducer;
