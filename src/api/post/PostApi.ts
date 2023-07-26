import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../shared/query.ts';

interface IGetPostRequestParams {
  shop_id: number;
}
export interface IPost {
  id: number;
  number: number;
  for_service: number;
  shop_id: number;
  created_at: string;
  updated_at: string;
}
export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: baseQuery,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<IPost[], IGetPostRequestParams>({
      query: (params) => ({
        url: '/posts/get',
        method: 'POST',
        body: { ...params },
      }),
    }),
  }),
});

export const { useGetPostsQuery } = postApi;
