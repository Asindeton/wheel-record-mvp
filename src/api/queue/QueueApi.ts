import { baseQuery } from '../shared/query.ts';
import { createApi } from '@reduxjs/toolkit/query/react';

export const queueApi = createApi({
  reducerPath: 'queueApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getQueue: builder.query({
      query: () => ({
        url: '/queue',
      }),
    }),
  }),
});
