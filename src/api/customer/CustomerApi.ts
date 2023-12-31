import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IGetShopResponse, IGetShopRequestParams } from '../shop/ShopApi.ts';
import { ICar, IGetCarRequestParams, INewCar, queueApi } from '../queue/QueueApi.ts';

const token = import.meta.env.VITE_AUTH_TOKEN;
const type = import.meta.env.VITE_AUTH_TYPE;
const isProxy = import.meta.env.VITE_PROXY === 'true';
export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isProxy ? '/api' : (import.meta.env.VITE_BACKEND_URL as string),
    prepareHeaders: (headers) => {
      if (token && type) {
        headers.set('authorization', `${type} ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getShopAsCustomer: builder.query<IGetShopResponse, IGetShopRequestParams>({
      query: (params) => ({
        url: '/shops/get',
        method: 'POST',
        body: { ...params },
        // method: 'GET',
        // params,
      }),
    }),
    addRecordCustomer: builder.mutation<ICar, INewCar>({
      query: (params) => ({
        url: '/records/add',
        method: 'POST',
        body: { ...params },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(queueApi.util.invalidateTags(['Queue']));
      },
    }),
    getRecordCustomer: builder.query<ICar, IGetCarRequestParams>({
      query: (params) => ({
        url: '/records/get',
        method: 'POST',
        body: { ...params },
      }),
    }),
    deleteRecordCustomer: builder.mutation<unknown, IGetCarRequestParams>({
      query: (params) => ({
        url: '/records/delete',
        method: 'POST',
        body: { ...params },
      }),
    }),
  }),
});

export const {
  useGetShopAsCustomerQuery,
  useAddRecordCustomerMutation,
  useGetRecordCustomerQuery,
  useDeleteRecordCustomerMutation,
} = customerApi;
