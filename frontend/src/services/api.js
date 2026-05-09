import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '../constants/api-endpoints';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  reducerPath: 'api',
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,

  endpoints: (builder) => ({
    checkEmail: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.CHECK_EMAIL,
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.REGISTER,
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.LOGIN,
        method: 'POST',
        body,
      }),
    }),

    purchase: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.PURCHASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS'],
    }),

    sell: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SELL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS'],
    }),

    getDetails: builder.query({
      query: ({ user_id }) => ({
        url: ENDPOINTS.GET_DETAILS,
        method: 'GET',
        params: { user_id },
      }),
      providesTags: ['INVESTMENT_DETAILS'],
    }),

    getPerformance: builder.query({
      query: ({ user_id }) => ({
        url: ENDPOINTS.GET_PERFORMANCE,
        method: 'GET',
        params: { user_id },
      }),
    }),
  }),
});

export const { useCheckEmailMutation, useRegisterMutation, useLoginMutation, usePurchaseMutation, useSellMutation, useGetDetailsQuery, useGetPerformanceQuery } = api;
