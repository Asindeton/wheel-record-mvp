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
      localStorage.setItem('token', payload.access_token);
      localStorage.setItem('token_type', payload.token_type);
      state.token_type = payload.token_type;
      state.expires_in = payload.expires_in;
      state.access_token = payload.access_token;
    },
    checkToken: (state) => {
      const token = localStorage.getItem('token');
      const token_type = localStorage.getItem('token_type');
      if (token && token_type) {
        state.access_token = token;
        state.token_type = token_type;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('token_type');
      return initialState;
    },
  },
});

export const { setCredentials, checkToken, logout } = slice.actions;

export default slice.reducer;
