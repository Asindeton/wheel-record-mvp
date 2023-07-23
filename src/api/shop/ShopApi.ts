import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../shared/query.ts';

interface IGetShopRequestParams {
  id: number;
}

interface IGetShopResponse {
  id: number;
  name: string;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getShop: builder.query<IGetShopResponse, IGetShopRequestParams>({
      query: (params) => ({
        url: '/shops/get',
        method: 'POST',
        body: { ...params },
        // method: 'GET',
        // params,
      }),
    }),
  }),
});

export const { useGetShopQuery } = shopApi;
