import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';

const isProxy = import.meta.env.VITE_PROXY === 'true';
export const baseQuery = fetchBaseQuery({
  baseUrl: isProxy ? '/api' : (import.meta.env.VITE_BACKEND_URL as string),
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
