import { baseQuery } from '../shared/query.ts';
import { createApi } from '@reduxjs/toolkit/query/react';
import { CustomerStatus } from '../../constants/StatusData.ts';

export interface ICar extends INewCar {
  id: number;
  post_id: number | null;
  number: number | null;
  active: number;
  sort: number;
  created_at: string;
  updated_at: string;
}
export type CreateFrom = 'client' | 'manager';

export interface INewCar {
  shop_id: number;
  contact_name: string;
  contact_phone: string;
  car_brand: string;
  car_model: string;
  car_number: string;
  status: CustomerStatus;
  type: CreateFrom;
}
interface IGetQueueRequestParams {
  shop_id: number;
}
export interface IGetCarRequestParams {
  id: number;
}

export interface IUpdateCarRequestParams {
  id: number;
  status: CustomerStatus;
  post_id: number | null;
  sort: number;
}

export const queueApi = createApi({
  reducerPath: 'queueApi',
  baseQuery: baseQuery,
  tagTypes: ['Queue'],
  endpoints: (builder) => ({
    getQueue: builder.query<ICar[], IGetQueueRequestParams>({
      query: (params) => ({
        url: '/records/get',
        method: 'POST',
        body: { ...params },
        // method: 'GET',
        // params,
      }),
      providesTags: ['Queue'],
    }),
    editQueue: builder.mutation<boolean, IUpdateCarRequestParams>({
      query: (params) => ({
        url: '/records/edit',
        method: 'POST',
        body: { ...params },
        // method: 'GET',
        // params,
      }),
      invalidatesTags: ['Queue'],
    }),
    deleteRecord: builder.mutation<unknown, IGetCarRequestParams>({
      query: (params) => ({
        url: '/records/delete',
        method: 'POST',
        body: { ...params },
      }),
      invalidatesTags: ['Queue'],
    }),
  }),
});

export const { useGetQueueQuery, useDeleteRecordMutation, useEditQueueMutation } = queueApi;
