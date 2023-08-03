import { baseQuery } from '../shared/query.ts';
import { createApi } from '@reduxjs/toolkit/query/react';
import { CustomerStatus } from '../../constants/StatusData.ts';

export interface ITimesInStatus {
  d: number;
  h: number;
  i: number;
  s: number;
}
export interface ICar extends INewCar {
  id: number;
  post_id: number | null;
  number: number | null;
  active: number;
  sort: number;
  created_at: string;
  updated_at: string;
  time_in_status: ITimesInStatus;
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
  make_first: 0 | 1;
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
  top_id?: number | undefined;
  bottom_id?: number | undefined;
}

export interface IGetCountRequestParams {
  shop_id: number;
  status: CustomerStatus[];
}

export const queueApi = createApi({
  reducerPath: 'queueApi',
  baseQuery: baseQuery,
  tagTypes: ['Queue', 'Count', 'Time'],
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
      invalidatesTags: ['Queue', 'Time', 'Count'],
    }),
    deleteRecord: builder.mutation<unknown, IGetCarRequestParams>({
      query: (params) => ({
        url: '/records/delete',
        method: 'POST',
        body: { ...params },
      }),
      invalidatesTags: ['Queue', 'Time', 'Count'],
    }),
    getCount: builder.query<number, IGetCountRequestParams>({
      query: (params) => ({
        url: '/records/count',
        method: 'POST',
        body: { ...params },
      }),
      providesTags: ['Count'],
    }),
    getTime: builder.query<ITimesInStatus, IGetCountRequestParams>({
      query: (params) => ({
        url: '/records/time',
        method: 'POST',
        body: { ...params },
      }),
      providesTags: ['Time'],
    }),
  }),
});

export const { useGetQueueQuery, useDeleteRecordMutation, useEditQueueMutation, useGetCountQuery, useGetTimeQuery } =
  queueApi;
