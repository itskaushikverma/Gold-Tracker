import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '../constants/api-endpoints';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['INVESTMENT_DETAILS', 'INVESTMENT_PERFORMANCE', 'SELLING_PRICE_PERFORMANCE'],

  endpoints: (builder) => ({
    health: builder.query({
      query: () => ({
        url: ENDPOINTS.HEALTH,
        method: 'GET',
      }),
    }),

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
    logout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
    }),

    purchase: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.PURCHASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS', 'INVESTMENT_PERFORMANCE'],
    }),

    sell: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SELL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS', 'INVESTMENT_PERFORMANCE'],
    }),

    setCustomSellingPrice: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SET_CUSTOM_SELLING_PRICE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SELLING_PRICE_PERFORMANCE'],
    }),

    getDetails: builder.query({
      query: ({ customGoldSellingPrice } = {}) => ({
        url: ENDPOINTS.GET_DETAILS,
        method: 'GET',
        params: customGoldSellingPrice ? { customGoldSellingPrice } : undefined,
      }),
      providesTags: ['INVESTMENT_DETAILS'],
    }),

    getPerformance: builder.query({
      query: ({ customGoldSellingPrice } = {}) => ({
        url: ENDPOINTS.GET_PERFORMANCE,
        method: 'GET',
        params: customGoldSellingPrice ? { customGoldSellingPrice } : undefined,
      }),
      providesTags: ['INVESTMENT_PERFORMANCE'],
    }),

    getSellingPricePerformance: builder.query({
      query: () => ({
        url: ENDPOINTS.GET_SELLING_PRICE_PERFORMANCE,
        method: 'GET',
      }),
      providesTags: ['SELLING_PRICE_PERFORMANCE'],
    }),

    getSellingPricePerformanceAi: builder.query({
      query: () => ({
        url: ENDPOINTS.GET_SELLING_PRICE_PERFORMANCE_AI,
        method: 'GET',
      }),
      providesTags: ['SELLING_PRICE_PERFORMANCE'],
    }),
  }),
});

export const {
  useHealthQuery,
  useCheckEmailMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  usePurchaseMutation,
  useSellMutation,
  useSetCustomSellingPriceMutation,
  useGetDetailsQuery,
  useGetPerformanceQuery,
  useGetSellingPricePerformanceQuery,
  useGetSellingPricePerformanceAiQuery,
} = api;
