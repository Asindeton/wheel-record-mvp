import { createApi } from '@reduxjs/toolkit/query/react';
import { LoginData } from '../../pages/Employe/EmployeeAuth/EmployeeAuth.tsx';
import { baseQuery } from '../shared/query.ts';
import { logout } from '../../pages/Employe/EmployeeAuth/authSlice.ts';

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const employeeAuthApi = createApi({
  reducerPath: 'employeeAuthApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, LoginData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // TODO после исправления поменять местами
          dispatch(logout());
          await queryFulfilled;
        } catch (e) {
          console.log({ e });
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = employeeAuthApi;
