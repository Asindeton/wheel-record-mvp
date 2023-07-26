import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';

export const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access_token;
    const type = (getState() as RootState).auth.token_type;
    if (token && type) {
      headers.set('authorization', `${type} ${token}`);
    }
    return headers;
  },
  timeout: 5000,
});
